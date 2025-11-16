import { useState } from "react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SessionSummaryProps {
  messages: Message[];
  onSaveSession: () => void | Promise<void>;
  darkMode: boolean;
  isSaving?: boolean;
}

export default function SessionSummary({ messages, onSaveSession, darkMode, isSaving }: SessionSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const userMessages = messages.filter(msg => msg.role === "user");
  const spinOMessages = messages.filter(msg => msg.role === "assistant");
  
  const sessionDuration = messages.length > 0 
    ? Math.round((messages[messages.length - 1].timestamp.getTime() - messages[0].timestamp.getTime()) / 1000 / 60)
    : 0;

  const averageResponseLength = spinOMessages.length > 0
    ? Math.round(spinOMessages.reduce((acc, msg) => acc + msg.content.length, 0) / spinOMessages.length)
    : 0;

  const getEmotionAnalysis = () => {
    const emotions = ["sad", "angry", "anxious", "happy", "confused", "overwhelmed"];
    const emotionCounts: { [key: string]: number } = {};
    
    userMessages.forEach(msg => {
      emotions.forEach(emotion => {
        if (msg.content.toLowerCase().includes(emotion)) {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        }
      });
    });
    
    return emotionCounts;
  };

  const emotionAnalysis = getEmotionAnalysis();
  const dominantEmotion = Object.keys(emotionAnalysis).length > 0
    ? Object.entries(emotionAnalysis).sort(([,a], [,b]) => b - a)[0][0]
    : "neutral";

  return (
    <div className={`rounded-xl p-3 shadow-sm border transition-all duration-300 ${
      darkMode 
        ? 'bg-black border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📊 Session Summary
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`px-3 py-1 border-none rounded-lg cursor-pointer text-xs transition-colors ${
            darkMode 
              ? 'bg-gray-700 text-white hover:bg-gray-600' 
              : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
        >
          {isExpanded ? "Hide" : "Details"}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className={`text-center p-2 rounded-lg ${
          darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
        }`}>
          <div className={`text-lg font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            {messages.length}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Messages
          </div>
        </div>
        
        <div className={`text-center p-2 rounded-lg ${
          darkMode ? 'bg-green-900/30' : 'bg-green-50'
        }`}>
          <div className={`text-lg font-bold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
            {sessionDuration}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Minutes
          </div>
        </div>
      </div>

      {/* Save Session Button */}
      <button
        onClick={onSaveSession}
        disabled={isSaving || messages.length === 0}
        className={`w-full py-2 px-3 rounded-lg font-medium transition-all text-xs ${
          isSaving || messages.length === 0
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isSaving ? "Saving..." : "💾 Save Session"}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
                     {/* Detailed Stats */}
           <div className={`p-3 rounded-lg border ${
             darkMode ? 'bg-black border-gray-600' : 'bg-gray-50 border-gray-200'
           }`}>
             <h4 className={`text-xs font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Session Analytics
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  User Messages
                </span>
                <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userMessages.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  SpinO Responses
                </span>
                <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {spinOMessages.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Avg Response Length
                </span>
                <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {averageResponseLength} chars
                </span>
              </div>
            </div>
          </div>

                     {/* Emotion Analysis */}
           <div className={`p-3 rounded-lg border ${
             darkMode ? 'bg-black border-gray-600' : 'bg-gray-50 border-gray-200'
           }`}>
             <h4 className={`text-xs font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Emotion Analysis
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Dominant Emotion
                </span>
                <span className={`text-xs font-medium capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {dominantEmotion}
                </span>
              </div>
              {Object.keys(emotionAnalysis).length > 0 && (
                <div className="mt-2">
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Emotion Frequency:
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(emotionAnalysis).map(([emotion, count]) => (
                      <span
                        key={emotion}
                                                 className={`px-1 py-0.5 rounded text-xs ${
                           darkMode ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                         }`}
                      >
                        {emotion}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

                     {/* Recent Messages Preview */}
           <div className={`p-3 rounded-lg border ${
             darkMode ? 'bg-black border-gray-600' : 'bg-gray-50 border-gray-200'
           }`}>
             <h4 className={`text-xs font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Messages
            </h4>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {messages.slice(-3).map((msg, index) => (
                                 <div key={index} className={`text-xs p-1 rounded ${
                   msg.role === 'user'
                     ? darkMode ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-50 text-blue-700'
                     : darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-700'
                 }`}>
                  <div className="font-medium mb-0.5">
                    {msg.role === 'user' ? 'You' : 'SpinO'}
                  </div>
                  <div className="truncate">
                    {msg.content.length > 40 ? `${msg.content.substring(0, 40)}...` : msg.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 