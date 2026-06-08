export const SITE = {
  title: 'shck.dev',
  description: 'shck.dev — developer tools by Aleksandr: ccx and notion-mcp.',
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
    repo: 'shck-dev/ccx-context-system',
    accent: '#4f46e5',
    blurb: 'context manager for Claude Code I use daily — keeps per-thread state when the window resets',
  },
  {
    name: 'notion-mcp',
    repo: 'shck-dev/notion-mcp',
    accent: '#7c3aed',
    blurb: 'Notion MCP server I built: search, export, and import pages as markdown — no OAuth, just a browser cookie',
  },
] as const;
