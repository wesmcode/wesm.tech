/**
 * Application-wide constants
 * Following clean code principles: no magic numbers, centralized configuration
 */

// Breakpoints
export const MOBILE_BREAKPOINT = 768;
export const SMALL_MOBILE_BREAKPOINT = 430;

// Timing
export const EXIT_COUNTDOWN_SECONDS = 4;
export const MEMOIR_CONNECTION_DELAY_MS = 1500;
export const DATETIME_UPDATE_INTERVAL_MS = 60000; // 1 minute
export const TYPEWRITER_DEFAULT_SPEED_MS = 20;
export const HUMAN_TYPEWRITER_SPEED_MS = 30;
export const AUTO_SCROLL_DELAY_MS = 100;
export const SKIP_ANIMATION_RESET_DELAY_MS = 100;
export const CONTACT_INFO_LOAD_DELAY_MS = 500;

// Touch targets (accessibility)
export const MIN_TOUCH_TARGET_SIZE_PX = 48;

// Z-index scale
export const Z_INDEX = {
  TERMINAL: 10,
  MOBILE_CONTROLS: 30,
  MODAL: 50,
  SKIP_LINK: 100,
} as const;

// Mobile controls
export const MOBILE_CONTROLS_HEIGHT_PX = 60;

// URLs
export const LINKEDIN_URL = "https://www.linkedin.com/in/wesmelo";
export const RESUME_PDF_PATH = "/wesley_melo_resume_remote.pdf";
export const MEDIUM_URL = "https://wesm.medium.com";

// Site metadata
export const SITE_VERSION = "v1.0.0";
export const SITE_NAME = "wesm.tech";
export const AUTHOR_NAME = "Wesley Melo";
export const COPYRIGHT_YEAR = 2025;
