"use client";

type TeleologyViewModel = {
  teleologyScore: number;
  teleologyType: string | null;
  manipulationRisk: string;
  detectedPhrases: string[];
  purposeClaim: string | null;
  neutralCausalParaphrase: string | null;
};

interface TeleologyPanelProps {
  teleology: TeleologyViewModel | null;
  darkMode?: boolean;
  isEmotionalStorm?: boolean;
}

export default function TeleologyPanel({ teleology, darkMode = true, isEmotionalStorm = false }: TeleologyPanelProps) {
  if (isEmotionalStorm) {
    return null;
  }

  if (!teleology) {
    return (
      <div className={`rounded-xl border p-3 text-sm ${
        darkMode 
          ? 'border-neutral-700/60 text-neutral-400' 
          : 'border-neutral-300 text-neutral-600'
      }`}>
        <div className={`font-semibold mb-1 ${
          darkMode ? 'text-neutral-200' : 'text-neutral-800'
        }`}>
          SpiñO Analysis – Purpose Story Check
        </div>
        <div>No purpose story pattern detected in the last message.</div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-3 text-sm space-y-2 ${
      darkMode 
        ? 'border-neutral-700/60' 
        : 'border-neutral-300'
    }`}>
      <div className={`font-semibold ${
        darkMode ? 'text-neutral-50' : 'text-neutral-900'
      }`}>
        SpiñO Analysis – Purpose Story Check
      </div>
      <div className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-600'} mb-2`}>
        Teleology here means a hidden purpose story – a way of telling yourself that this happened "for a reason" to you, instead of just seeing the causes.
      </div>

      <div className={`flex items-center justify-between text-xs ${
        darkMode ? 'text-neutral-300' : 'text-neutral-700'
      }`}>
        <span>Score:</span>
        <span className="font-medium">{teleology.teleologyScore.toFixed(2)}</span>
      </div>

      <div className={`flex items-center justify-between text-xs ${
        darkMode ? 'text-neutral-300' : 'text-neutral-700'
      }`}>
        <span>Type:</span>
        <span className="font-medium">{teleology.teleologyType ?? "none"}</span>
      </div>

      <div className={`flex items-center justify-between text-xs ${
        darkMode ? 'text-neutral-300' : 'text-neutral-700'
      }`}>
        <span>Manipulation risk:</span>
        <span className={`font-medium capitalize ${
          teleology.manipulationRisk === 'high' 
            ? 'text-red-400' 
            : teleology.manipulationRisk === 'medium'
            ? 'text-yellow-400'
            : 'text-green-400'
        }`}>
          {teleology.manipulationRisk}
        </span>
      </div>

      <div className={`text-xs ${
        darkMode ? 'text-neutral-300' : 'text-neutral-700'
      }`}>
        <div className={`font-medium mb-1 ${
          darkMode ? 'text-neutral-200' : 'text-neutral-800'
        }`}>
          Detected phrases
        </div>
        <div className={darkMode ? 'text-neutral-300' : 'text-neutral-600'}>
          {teleology.detectedPhrases.length > 0
            ? teleology.detectedPhrases.join(", ")
            : "none"}
        </div>
      </div>

      {teleology.purposeClaim && (
        <div className={`text-xs ${
          darkMode ? 'text-neutral-300' : 'text-neutral-700'
        }`}>
          <div className={`font-medium mb-1 ${
            darkMode ? 'text-neutral-200' : 'text-neutral-800'
          }`}>
            Purpose story
          </div>
          <div className={`italic ${
            darkMode ? 'text-neutral-300' : 'text-neutral-600'
          }`}>
            {teleology.purposeClaim}
          </div>
        </div>
      )}

      {teleology.neutralCausalParaphrase && (
        <div className={`text-xs ${
          darkMode ? 'text-neutral-300' : 'text-neutral-700'
        }`}>
          <div className={`font-medium mb-1 ${
            darkMode ? 'text-neutral-200' : 'text-neutral-800'
          }`}>
            Causal paraphrase
          </div>
          <div className={darkMode ? 'text-neutral-300' : 'text-neutral-600'}>
            {teleology.neutralCausalParaphrase}
          </div>
        </div>
      )}
    </div>
  );
}

