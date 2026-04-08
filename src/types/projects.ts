export interface ProjectModel3D {
  src: string;
  poster: string;
  alt: string;
  cameraOrbit?: string;
  cameraTarget?: string;
  fieldOfView?: string;
  notes?: string[];
}

export interface ProjectGalleryImage {
  src: string;
  caption: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  year: string;
  role: string;
  tools: string;
  summary: string;
  description: string;
  bullets: string[];
  color: string;
  image: string | null;
  gallery: ProjectGalleryImage[];
  pills: string[];
  githubUrl?: string;
  liveUrl?: string;
  model3d?: ProjectModel3D;
}
