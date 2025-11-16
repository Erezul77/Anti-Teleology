"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

/**
 * Drop-in replacement for any "Take the test" button.
 * Usage: <StartIdeaWalkthroughButton />
 */
export default function StartIdeaWalkthroughButton({
  labelEn = "Start the Idea Walkthrough",
  labelHe = "התחל/י את מסלול הרעיון",
  className = "",
}: {
  labelEn?: string;
  labelHe?: string;
  className?: string;
}) {
  const [hebrew, setHebrew] = useState(false);
  useEffect(() => {
    try {
      const lang = navigator?.language?.toLowerCase() ?? "";
      setHebrew(lang.startsWith("he") || lang.includes("iw"));
    } catch {}
  }, []);
  return (
    <Link
      href="/idea-walkthrough"
      className={
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm md:text-base shadow-md hover:shadow-lg transition " +
        "bg-black text-white dark:bg-white dark:text-black " +
        className
      }
    >
      {hebrew ? labelHe : labelEn}
    </Link>
  );
}
