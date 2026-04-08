export const social = {
  name: "social",
  title: "Social",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      description: "e.g. GitHub, LinkedIn",
    },
    {
      name: "url",
      title: "URL",
      type: "url",
    },
    {
      name: "icon",
      title: "Icon",
      type: "image",
      options: {
        hotspot: true,
      },
    },
  ],
};
