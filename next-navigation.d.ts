// Type declaration to help TypeScript resolve next/navigation with Node16 module resolution
// This is a workaround for TypeScript's strict Node16 module resolution with Next.js
declare module 'next/navigation' {
  export function notFound(): never
  export function redirect(url: string | URL, type?: 'push' | 'replace'): never
  export function permanentRedirect(url: string | URL, type?: 'push' | 'replace'): never
  export type RedirectType = 'push' | 'replace'
  
  export function useRouter(): {
    push: (href: string) => void
    replace: (href: string) => void
    prefetch: (href: string) => void
    back: () => void
    forward: () => void
    refresh: () => void
  }
  export function usePathname(): string
  export function useSearchParams(): ReadonlyURLSearchParams
  export function useParams<T extends Record<string, string | string[]>>(): T
  export function useSelectedLayoutSegments(parallelRouteKey?: string): string[]
  export function useSelectedLayoutSegment(parallelRouteKey?: string): string | null
  
  export class ReadonlyURLSearchParams extends URLSearchParams {
    readonly [Symbol.toStringTag]: 'URLSearchParams'
  }
}

