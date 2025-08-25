export function intToDiff(diff: number) {
  let ret = ""

  if (diff === 0) return "알 수 없음"
  if (diff <= 5) ret = "브론즈"
  else if (diff <= 10) ret = "실버"
  else if (diff <= 15) ret = "골드"
  else if (diff <= 20) ret = "플래티넘"
  else if (diff <= 25) ret = "다이아몬드"
  else ret = "루비"

  ret += ` ${5 - ((diff - 1) % 5)}`
  return ret
}

export function getColorOfDiff(diff: number) {
  if (diff === 0) return "#000"
  if (diff <= 5) return "#ad5600"
  if (diff <= 10) return "#435f7a"
  if (diff <= 15) return "#ec9a00"
  if (diff <= 20) return "#27e2a4"
  if (diff <= 25) return "#00b4fc"
  else return "#ff0062"
}
