"use client";
import React from "react";
import PDWizardV6 from "../../components/PDWizardV6";

export default function Page() {
  return (
    <PDWizardV6
      input={{
        emotion: "shame",
        sub: "exposed",
        target_kind: "person",
        target_role: "boss/teacher",
        part: "people_watching",
        rule: "I must be perfect",
        intensity_before: 7,
        clarity_before: 3,
      }}
      onComplete={(out) => console.log("PD Wizard out", out)}
    />
  );
}
