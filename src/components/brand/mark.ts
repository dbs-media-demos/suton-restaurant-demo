// Plain (server-safe) module: Logo.tsx is a client component, so server code such as
// the OG route must import the mark geometry from here, not from Logo.
/** Mark geometry, shared with the favicon and OG image. A half sun sinking into three river lines. */
export const MARK = {
  sun: "M14 37a18 18 0 0 1 36 0z",
  lines: [
    { x1: 9, x2: 55, y: 44 },
    { x1: 17, x2: 47, y: 50.5 },
    { x1: 25, x2: 39, y: 57 },
  ],
};
