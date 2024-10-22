/**
 * An array of routes that are accesible to the public
 * These routes do not require authentification
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * The authentication routes
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/new-password",
  "/auth/new-password/reset-password",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for Api authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after loggin in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
