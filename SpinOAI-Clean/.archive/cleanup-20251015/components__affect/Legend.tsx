export default function Legend(){
  return (
    <div className="text-xs leading-relaxed opacity-85">
      <div className="mb-3">Each affect appears twice: a <span className="text-[#ff7676]">passive</span> form and its <span className="text-[#76ffd1]">active</span> transformation. The line between them is the transition to adequacy.</div>
      <ul className="space-y-2">
        <li>• <b>Fear → Prudence</b>: seeing the cause of danger.</li>
        <li>• <b>Anger → Assertion</b>: from blame to clear boundary.</li>
        <li>• <b>Envy → Admiration</b>: rival → model.</li>
        <li>• <b>Pity → Compassion</b>: shared cause of suffering.</li>
        <li>• <b>Pride → Self-Esteem</b>: confused → true self-cause.</li>
        <li>• <b>Love → Benevolence</b>: object-bound → universal.</li>
        <li>• <b>Guilt → Responsibility</b>: blame → repair.</li>
        <li>• <b>Hope → Rational Trust</b>: uncertainty → stable cause.</li>
      </ul>
      <div className="mt-3 opacity-60">Tip: hover a node to see Passive/Active; click to highlight its active target.</div>
    </div>
  );
}
