"use client";

import { Flip } from "gsap/Flip";
import { gsap } from "./gsap";

// Only the filterable lists need Flip, so it stays out of the shared chunk.
if (typeof window !== "undefined") gsap.registerPlugin(Flip);

export { Flip };
