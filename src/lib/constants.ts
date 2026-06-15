/** The single canonical list of languages a bounty can be tagged with. The
 *  create wizard offers exactly these; the board/leaderboard filters derive
 *  from them so a hunter can never filter for a language no bounty can have. */
export const SUPPORTED_LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Solidity",
  "Rust",
  "Go",
  "Python",
] as const;
