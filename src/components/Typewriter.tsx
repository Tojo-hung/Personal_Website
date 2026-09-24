"use client";

import { useEffect, useReducer } from "react";

const TICK_MS = 55;
const HOLD_FULL = 34;
const HOLD_EMPTY = 6;

interface TypeState {
  wordIndex: number;
  chars: number;
  deleting: boolean;
  holdTicks: number;
}

function tick(words: string[]) {
  return (s: TypeState): TypeState => {
    const word = words[s.wordIndex];
    if (s.holdTicks > 0) return { ...s, holdTicks: s.holdTicks - 1 };
    if (!s.deleting) {
      return s.chars < word.length
        ? { ...s, chars: s.chars + 1 }
        : { ...s, deleting: true, holdTicks: HOLD_FULL };
    }
    if (s.chars > 0) return { ...s, chars: s.chars - 1 };
    return {
      wordIndex: (s.wordIndex + 1) % words.length,
      chars: 0,
      deleting: false,
      holdTicks: HOLD_EMPTY,
    };
  };
}

interface TypewriterProps {
  words: string[];
  /** Shown instead of the cycling words when motion is reduced. */
  stillText: string;
  still: boolean;
  caretOn: boolean;
}

export default function Typewriter({ words, stillText, still, caretOn }: TypewriterProps) {
  const [state, advance] = useReducer(
    (s: TypeState) => tick(words)(s),
    { wordIndex: 0, chars: 0, deleting: false, holdTicks: 0 },
  );

  useEffect(() => {
    if (still) return;
    const id = setInterval(advance, TICK_MS);
    return () => clearInterval(id);
  }, [still]);

  const text = still ? stillText : words[state.wordIndex].slice(0, state.chars);

  return (
    <>
      <span className="text-bamboo-ink">{text}</span>
      <span
        aria-hidden="true"
        className="ml-1 inline-block h-[38px] w-[3px] align-[-5px] md:h-[52px] md:align-[-6px]"
        style={{ background: still || caretOn ? "var(--bamboo-ink)" : "transparent" }}
      />
    </>
  );
}
