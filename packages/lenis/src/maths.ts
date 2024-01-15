// Clamp a value between a minimum and maximum value
export function clamp(min: number, input: number, max: number) {
  return Math.max(min, Math.min(input, max))
}

// Truncate a floating-point number to a specified number of decimal places
export function truncate(value: number, decimals = 0) {
  return parseFloat(value.toFixed(decimals))
}

// Linearly interpolate between two values using an amount (0 <= t <= 1)
export function lerp(x: number, y: number, t: number) {
  return (1 - t) * x + t * y
}

// http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/
export function damp(x: number, y: number, lambda: number, dt: number) {
  return lerp(x, y, 1 - Math.exp(-lambda * dt))
}

// Calculate the modulo of the dividend and divisor while keeping the result within the same sign as the divisor
// https://anguscroll.com/just/just-modulo
export function modulo(n: number, d: number) {
  return ((n % d) + d) % d
}
