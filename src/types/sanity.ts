interface SanityBody {
  _createdAt: string;
  _id: string;
  _rev: string;
  _updatedAt: string;
}

interface Image {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface PageInfo extends SanityBody {
  _type: "pageInfo";
  name: string;
  role: string;
  heroRotatingTexts: string[];
  backgroundImage?: Image;
  profileImage?: Image;
}

export interface Skill extends SanityBody {
  _type: "skill";
  title: string;
  iconUrl?: Image;
  proficiency: number;
}

export interface Experience extends SanityBody {
  _type: "experience";
  company: string;
  role: string;
  dateRange: string;
  description: string;
  techStack: Skill[];
  companyImage?: Image;
}

export interface Project extends SanityBody {
  _type: "project";
  title: string;
  description: string;
  image?: Image;
  techStack: Skill[];
  linkToBuild?: string;
  linkToGithub?: string;
}

export interface Social extends SanityBody {
  _type: "social";
  title: string;
  url: string;
  icon?: Image;
}
