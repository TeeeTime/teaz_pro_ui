/** Teaz Account: manages accounts and profile pictures for the whole ecosystem. */
export const ACCOUNT_URL = 'https://account.teaz.pro'

/**
 * URL of a user's profile picture, by Keycloak user id (`sub`). Public, so it
 * works in a plain `<img>`. Answers 404 for users without a picture: `Avatar`
 * and `TopBar` then show the initials. `size`: 64, 128, 256 or 512 px.
 */
export function avatarUrl(userId: string | null | undefined, size = 128): string | undefined {
  return userId ? `${ACCOUNT_URL}/api/avatars/${encodeURIComponent(userId)}?size=${size}` : undefined
}
