export const skill = {
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "iconUrl",
      title: "Icon URL (or image)",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Upload an icon or image representing the skill",
    },
    {
      name: "proficiency",
      title: "Proficiency",
      type: "number",
      description: "Proficiency level from 1 to 100",
      validation: (Rule: any) => Rule.min(1).max(100),
    },
  ],
};
