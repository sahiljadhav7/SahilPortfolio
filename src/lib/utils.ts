import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * shadcn-style cn() utility: merges Tailwind classes intelligently
 * combining clsx (conditional classes) with tailwind-merge (deduplication)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
