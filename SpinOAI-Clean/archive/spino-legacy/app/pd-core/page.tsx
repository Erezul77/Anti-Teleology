"use client";
import React from "react";
import PDCoreBlock from "../../components/PDCoreBlock";

export default function Page() {
  // Example input - you can modify this or make it dynamic
  const exampleInput = {
    emotion: "shame" as const,
    sub: "exposed",
    target_kind: "person" as const,
    target_role: "boss",
    part: "people_watching" as const,
    rule: "I must be perfect",
    intensity_before: 7,
    clarity_before: 3,
    link: "with" as const,
  };

  return (
    <div className="min-h-[100svh] bg-gray-50">
      <PDCoreBlock
        input={exampleInput}
        onComplete={(out) => {
          console.log("PD Core output:", out);
          // You can add additional processing here
        }}
      />
    </div>
  );
}
