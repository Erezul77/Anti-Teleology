export const metadata = { title: "Affect Plane — SpiñO" };

import AffectPlane from "../../../components/affect/AffectPlane";
import Legend from "../../../components/affect/Legend";

export default function Page(){
  return (
    <main className="min-h-screen bg-[#0b0b12] text-white">
      <div className="max-w-[900px] mx-auto px-6 py-6">
        <h1 className="text-xl font-semibold opacity-90 mb-2">Affect Plane</h1>
        <p className="text-sm opacity-70 mb-4">Passive ↔ Active (X) • Sadness ↔ Joy (Y)</p>
        <div className="grid md:grid-cols-[680px_1fr] gap-6">
          <AffectPlane />
          <Legend />
        </div>
      </div>
    </main>
  );
}
