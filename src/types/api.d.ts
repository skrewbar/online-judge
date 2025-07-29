type RegisterField = "handle" | "email" | "password" | "pwcheck" | "form"
export interface RegisterResponse {
  success: boolean
  error?: {
    message: string
    field: RegisterField
  }
}
