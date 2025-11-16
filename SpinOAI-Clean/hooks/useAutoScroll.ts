"use client";
import { useEffect, RefObject } from "react";

export default function useAutoScroll(
  ref: RefObject<HTMLElement | null>,
  deps: any[] = [],
  behavior: ScrollBehavior = "smooth"
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      el.scrollTo({ top: el.scrollHeight, behavior });
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
