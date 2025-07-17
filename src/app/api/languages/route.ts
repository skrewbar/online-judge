import { Language } from "@/types/language"

const languages: Language[] = [
  {
    name: "C++23",
    compile:
      "g++ Main.cpp -o Main -O2 -Wall -lm -static -std=gnu++23 -DONLINE_JUDGE",
    execute: "./Main",
    version: "g++ (GCC) 14.2.0",
  },
  {
    name: "Python3",
    compile: `python3 -W ignore -c "import py_compile; py_compile.compile(r'Main.py')"`,
    execute: "python3 -W ignore Main.py",
    version: "Python 3.13",
  },
  {
    name: "Java 15",
    compile:
      "javac -release 15 -J-Xms1024m -J-Xmx1920m -J-Xss512m -encoding UTF-8 Main.java",
    execute:
      "java -Xms1024m -Xmx1920m -Xss512m -Dfile.encoding=UTF-8 -XX:+UseSerialGC -DONLINE_JUDGE=1 Main",
    version: `openjdk version "16.0.1" 2021-04-20`,
  },
]

export async function GET() {
  return new Response(JSON.stringify(languages), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
