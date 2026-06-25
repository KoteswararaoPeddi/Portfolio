import type { SchemaTypeDefinition } from "sanity"

import { aboutType } from "./aboutType"
import { experienceType } from "./experienceType"
import { heroType } from "./heroType"
import { projectType } from "./projectType"

export const schemaTypes: SchemaTypeDefinition[] = [
  heroType,
  aboutType,
  projectType,
  experienceType,
]
