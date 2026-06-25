import { defineField, defineType } from "sanity"

export const aboutType = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow label",
      type: "string",
      description: "Small pill, e.g. 'About Me'.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 6,
      description: "Leave a blank line between paragraphs.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "features",
      title: "Feature cards",
      type: "array",
      validation: (rule) => rule.min(1).max(3),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Code", value: "code" },
                  { title: "Layers", value: "layers" },
                  { title: "Performance (bolt)", value: "zap" },
                ],
                layout: "radio",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "icon" },
          },
        },
      ],
    }),
    defineField({
      name: "image",
      title: "Portrait image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare: () => ({ title: "About" }),
  },
})
