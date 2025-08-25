"use server"

import { prisma } from "@/lib/prisma"

import { generalInfoSchema } from "./schemas"
import z from "zod"

export type GeneralInfoState = {
  id: number
} & z.infer<typeof generalInfoSchema>

export async function editAction(
  prevState: GeneralInfoState,
  formData: FormData
) {
  return prevState
}
