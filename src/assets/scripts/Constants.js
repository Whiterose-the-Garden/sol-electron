export const DAYS_IN_WEEK = 7
export const CAL_HEIGHT = 6
const MONTH_OFFSET = 100
const YEAR_OFFSET = MONTH_OFFSET * 100
export function hashDate(d) {
  return "a" + (d.getFullYear() * YEAR_OFFSET + 
    d.getMonth() * MONTH_OFFSET + 
    d.getDate()).toString()
}

export function sameDate(d1, d2) {
  return d1.getDate() === d2.getDate() && 
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
}

