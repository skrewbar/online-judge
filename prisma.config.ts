import dotenv from "dotenv"
import dotenvExpand from "dotenv-expand"
import { defineConfig } from "prisma/config"

const env = dotenv.config()
dotenvExpand.expand(env)

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
})
