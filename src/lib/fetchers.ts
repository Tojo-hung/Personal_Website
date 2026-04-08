import { sanityClient } from "./sanity";
import { Experience, PageInfo, Project, Skill, Social } from "../types/sanity";

export const getPageInfo = async (): Promise<PageInfo> => {
  const query = `*[_type == "pageInfo"][0]`;
  const pageInfo: PageInfo = await sanityClient.fetch(query);
  return pageInfo;
};

export const getExperiences = async (): Promise<Experience[]> => {
  const query = `*[_type == "experience"] {
    ...,
    techStack[]->
  }`;
  const experiences: Experience[] = await sanityClient.fetch(query);
  return experiences;
};

export const getSkills = async (): Promise<Skill[]> => {
  const query = `*[_type == "skill"]`;
  const skills: Skill[] = await sanityClient.fetch(query);
  return skills;
};

export const getProjects = async (): Promise<Project[]> => {
  const query = `*[_type == "project"] {
    ...,
    techStack[]->
  }`;
  const projects: Project[] = await sanityClient.fetch(query);
  return projects;
};

export const getSocials = async (): Promise<Social[]> => {
  const query = `*[_type == "social"]`;
  const socials: Social[] = await sanityClient.fetch(query);
  return socials;
};
