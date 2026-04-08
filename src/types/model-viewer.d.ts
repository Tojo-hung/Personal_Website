import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        alt?: string;
        src?: string;
        poster?: string;
        exposure?: number | string;
        loading?: "auto" | "eager" | "lazy";
        reveal?: "auto" | "interaction" | "manual";
        "camera-controls"?: boolean | string;
        "camera-orbit"?: string;
        "camera-target"?: string;
        "environment-image"?: string;
        "field-of-view"?: string;
        "interaction-prompt"?: "auto" | "none" | string;
        "interaction-prompt-threshold"?: number | string;
        "shadow-intensity"?: number | string;
        "touch-action"?: string;
      };
    }
  }
}

export {};
