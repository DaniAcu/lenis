export function debounce <F extends (...args: any) => any>(callback: F, delay: number) {
  let timeout = 0

  const debounced = (...args: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback(...args), delay)
  }

  return debounced as (...args: Parameters<F>) => ReturnType<F>
}
