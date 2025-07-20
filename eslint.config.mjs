import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"
import { includeIgnoreFile } from "@eslint/compat"

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url))

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
]

export default eslintConfig
