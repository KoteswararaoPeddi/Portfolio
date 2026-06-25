import { defineField, defineType } from "sanity"

export const heroType = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "availability",
      title: "Availability label",
      type: "string",
      description: "Small pill above the headline, e.g. 'Available for new projects'.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headlineLead",
      title: "Headline (lead)",
      type: "string",
      description: "Plain part of the headline, e.g. 'Building modern web experiences with '.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headlineHighlight",
      title: "Headline (highlighted word)",
      type: "string",
      description: "Teal-highlighted part, e.g. 'clean code'.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Primary button label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "primaryCtaHref",
      title: "Primary button link",
      type: "string",
      description: "Anchor (e.g. '#contact') or full URL.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Secondary button label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryCtaHref",
      title: "Secondary button link",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Hero" }),
  },
})
