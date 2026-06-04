export const SITE = {
  title: 'shck.dev',
  description: 'shck.dev — developer tools and open-source projects',
  author: 'shck',
  url: 'https://shck.dev',
};

/**
 * Tools whose GitHub releases feed /changelog (and the release→draft-post pipeline).
 * Adding a tool = one entry here; its releases.atom is fetched at build time.
 */
export const TOOLS = [
  {
    name: 'ccx',
    repo: 'ofcRS/ccx-context-system',
    blurb: 'scratch-notebook context management for Claude Code — per-thread STATE handoffs + a compiled INDEX dashboard',
  },
] as const;
