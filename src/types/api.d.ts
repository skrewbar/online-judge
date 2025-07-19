export interface RegisterResponse {
  success: boolean
  error?: {
    message: string
    label: "handle" | "email" | "password" | "pwcheck" | "form"
  }
}
