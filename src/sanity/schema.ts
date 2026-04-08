import { pageInfo } from "./schemas/pageInfo";
import { skill } from "./schemas/skill";
import { experience } from "./schemas/experience";
import { project } from "./schemas/project";
import { social } from "./schemas/social";

export const schema = {
  types: [pageInfo, skill, experience, project, social]
};
