import dynamic from "next/dynamic";

const GlassbreakerGame = dynamic(() => import("../../components/GlassbreakerGame"), { ssr: false });

export default function Page() {
  return (
    <main className="min-h-screen p-6">
      <GlassbreakerGame />
    </main>
  );
}
