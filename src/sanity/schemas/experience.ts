export const experience = {
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    {
      name: "company",
      title: "Company / Organization",
      type: "string",
    },
    {
      name: "role",
      title: "Role / Title",
      type: "string",
    },
    {
      name: "dateRange",
      title: "Date Range",
      type: "string",
      description: "e.g. 2024 — PRESENT",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "techStack",
      title: "Tech Stack",
      type: "array",
      of: [{ type: "reference", to: { type: "skill" } }],
    },
    {
      name: "companyImage",
      title: "Company Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
  ],
};
