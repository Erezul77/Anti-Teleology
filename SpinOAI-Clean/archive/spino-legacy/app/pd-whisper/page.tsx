"use client";
import PDWhisper from "../../components/PDWhisper";

export default function Page(){
  return (
    <PDWhisper
      onComplete={(out)=>console.log("PD Whisper output:", out)}
    />
  );
}
