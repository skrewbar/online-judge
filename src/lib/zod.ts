import { object, string } from "zod"

export const loginSchema = object({
  handle: string().min(1),
  password: string().min(1),
})
