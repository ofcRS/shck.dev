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
    accent: '#4f46e5',
    blurb: 'scratch-notebook context management for Claude Code — per-thread STATE handoffs + a compiled INDEX dashboard',
  },
  {
    name: 'notion-mcp',
    repo: 'shck-dev/notion-mcp',
    accent: '#7c3aed',
    blurb: 'Notion MCP server — search, export, and import pages as markdown; no OAuth, just a browser cookie',
  },
] as const;
