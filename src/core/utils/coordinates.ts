export const convertToDegrees = (n: number, axis: 'x' | 'y'): string => {
  const letter = axis === 'x' ? (n > 0 ? 'E' : 'W') : n > 0 ? 'N' : 'S'

  const absolute = Math.abs(n)
  const degrees = Math.floor(absolute)
  const minutesNotTruncated = (absolute - degrees) * 60
  const minutes = Math.floor(minutesNotTruncated)

  return `${degrees}° ${minutes}' ${letter}`
}
