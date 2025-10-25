/**
 * Window utilities
 * Centralized functions for window operations
 */

/**
 * Opens a URL in a new tab with security best practices
 * @param url - The URL to open
 * @param fallbackMessage - Optional message to show if popup is blocked
 * @returns The opened window or null if blocked
 */
export function openInNewTab(url: string, fallbackMessage?: string): Window | null {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");

  if (newWindow) {
    newWindow.focus();
  } else if (fallbackMessage) {
    // In a real app, this should be replaced with a toast notification
    alert(fallbackMessage);
  }

  return newWindow;
}

/**
 * Checks if user prefers reduced motion
 * @returns true if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks if the device is mobile based on screen width
 * @param breakpoint - The breakpoint to check against
 * @returns true if window width is less than breakpoint
 */
export function isMobileDevice(breakpoint: number): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoint;
}
