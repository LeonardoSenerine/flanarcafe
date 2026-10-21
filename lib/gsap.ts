"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  Object.assign(window, { gsap, ScrollTrigger });
}

export { gsap, ScrollTrigger, useGSAP };
