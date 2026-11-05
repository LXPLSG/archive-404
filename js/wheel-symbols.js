// Original vector paths generated with Higgsfield; see assets/TEXTURE-NOTES.md.
export const wheelSymbols=[
  {
    "name": "Mountain",
    "path": "<path d=\"M4.5 20.2 13.3 9.7l2.5-2.9 2.3 2.8 9.4 10.7\" />\n      <path d=\"m13.4 9.7 2.4 3 2.3-3\" />\n      <path d=\"M7.1 23.1c2.2-1.3 4.2-1.3 6.4 0 2.1 1.2 4.1 1.2 6.2 0\" />\n      <path d=\"M5.6 23.8c.4-.6.9-1 1.5-1.3\" />"
  },
  {
    "name": "Blossom",
    "path": "<path d=\"M16 15.8c-2.5-2.6-5.5-5.2-4.4-8.3.7-2.1 3-3.1 4.4-3.1s3.7 1 4.4 3.1c1.1 3.1-1.9 5.7-4.4 8.3Z\" />\n      <path d=\"M16 15.8c-.3-3.6-1.2-7.5 1.6-9.2 1.9-1.2 4.2-.5 5.3.5s1.9 3.4.6 5.2c-1.8 2.7-5.6 2.7-7.5 3.5Z\" transform=\"rotate(72 16 16)\" />\n      <path d=\"M16 15.8c-.3-3.6-1.2-7.5 1.6-9.2 1.9-1.2 4.2-.5 5.3.5s1.9 3.4.6 5.2c-1.8 2.7-5.6 2.7-7.5 3.5Z\" transform=\"rotate(144 16 16)\" />\n      <path d=\"M16 15.8c-.3-3.6-1.2-7.5 1.6-9.2 1.9-1.2 4.2-.5 5.3.5s1.9 3.4.6 5.2c-1.8 2.7-5.6 2.7-7.5 3.5Z\" transform=\"rotate(216 16 16)\" />\n      <path d=\"M16 15.8c-.3-3.6-1.2-7.5 1.6-9.2 1.9-1.2 4.2-.5 5.3.5s1.9 3.4.6 5.2c-1.8 2.7-5.6 2.7-7.5 3.5Z\" transform=\"rotate(288 16 16)\" />\n      <circle cx=\"16\" cy=\"16\" r=\"1.7\" />"
  },
  {
    "name": "Crescent",
    "path": "<path d=\"M22.8 7.2A11.8 11.8 0 1 0 23 24.8a10.8 10.8 0 0 1-.2-17.6Z\" />\n      <path d=\"M9.2 10.4h7.1M7.6 14.1h5.2M7.6 17.9h7M9.2 21.6h6\" />"
  },
  {
    "name": "Snow crystal",
    "path": "<path d=\"M16 4.5v23M6.1 10.3l19.8 11.4M6.1 21.7l19.8-11.4\" />\n      <path d=\"m13.5 7 2.5-2.5L18.5 7M13.5 25l2.5 2.5 2.5-2.5\" />\n      <path d=\"m8.6 14.7-2.5-4.4 4.8-.8M21.1 22.5l4.8-.8-2.5-4.4\" />\n      <path d=\"m8.6 17.3-2.5 4.4 4.8.8M21.1 9.5l4.8.8-2.5 4.4\" />\n      <circle cx=\"16\" cy=\"16\" r=\"1.2\" />"
  }
];
export const wheelSymbol=index=>`<svg viewBox="0 0 32 32" role="img" aria-label="${wheelSymbols[index].name}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${wheelSymbols[index].path}</svg>`;
