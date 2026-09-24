export interface ProjectModel3D {
  src: string;
  poster: string;
  alt: string;
  label: string;
  cameraOrbit?: string;
  cameraTarget?: string;
  fieldOfView?: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  when: string;
  role: string;
  image: string | null;
  summary: string;
  bullets: string[];
  gallery: string[];
  tools: string;
  links: ProjectLink[];
  model3d?: ProjectModel3D;
}

export interface TimelineEntry {
  when: string;
  role: string;
  place: string;
  image: string;
  line: string;
}
