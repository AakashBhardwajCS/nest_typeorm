// Name of the bearer security scheme registered in main.ts (DocumentBuilder.addBearerAuth).
// @ApiBearerAuth() on protected routes has to use the same name.
export const ACCESS_TOKEN_AUTH = 'access-token';

// How long a refresh token stays valid
export const REFRESH_TOKEN_TTL_DAYS = 3;
