"use client";
import Link from "next/link";
export default function StartSpinOStudioButton({ labelEn="Open SpinO Studio", labelHe="פתח/י SpinO Studio", className="" }:{
  labelEn?:string; labelHe?:string; className?:string;
}){
  const hebrew = typeof navigator!=="undefined" && (navigator.language?.toLowerCase().startsWith("he")||navigator.language?.toLowerCase().includes("iw"));
  return (
    <Link href="/studio"
      className={"inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm md:text-base shadow-md hover:shadow-lg transition bg-black text-white dark:bg-white dark:text-black " + className}>
      {hebrew ? labelHe : labelEn}
    </Link>
  );
}
