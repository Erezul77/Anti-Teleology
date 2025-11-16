'use client'

import React, { useState, useEffect } from 'react'
import { SessionManager, SessionData } from '../../lib/sessionManager'

interface SessionAnalyticsProps {
  darkMode: boolean
}

export default function SessionAnalytics({ darkMode }: SessionAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null)

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const sessionManager = SessionManager.getInstance()
      const analyticsData = await sessionManager.getSessionAnalytics()
      const localStorageSessions = sessionManager.loadSessionsFromLocalStorage()
      
      console.log('🔍 SessionAnalytics Debug:', {
        analyticsData,
        localStorageSessions: localStorageSessions.length,
        sessionsWithAnalytics: localStorageSessions.filter(s => s.analytics && typeof s.analytics === 'object').length,
        sessionsWithoutAnalytics: localStorageSessions.filter(s => !s.analytics || typeof s.analytics !== 'object').length
      })
      
      setAnalytics(analyticsData)
      setSessions(localStorageSessions)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      'anxiety': 'bg-yellow-500',
      'sadness': 'bg-blue-500',
      'anger': 'bg-red-500',
      'joy': 'bg-green-500',
      'fear': 'bg-purple-500',
      'compassion': 'bg-pink-500',
      'neutral': 'bg-gray-500'
    }
    return colors[emotion] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="text-center">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        📊 Session Analytics
      </h3>

      {analytics && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sessions</div>
            <div className={`text-lg font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              {analytics.totalSessions}
            </div>
          </div>
          
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Messages</div>
            <div className={`text-lg font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
              {analytics.totalMessages}
            </div>
          </div>
          
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg Length</div>
            <div className={`text-lg font-bold ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              {Math.round(analytics.averageSessionLength)}
            </div>
          </div>
          
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Top Emotions</div>
            <div className="flex gap-1 mt-1">
              {analytics.mostCommonEmotions?.slice(0, 2).map((emotion: string, index: number) => (
                <span
                  key={index}
                  className={`px-1 py-0.5 rounded text-xs text-white ${getEmotionColor(emotion)}`}
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mb-3">
        <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📝 Recent Sessions ({sessions.length})
        </h4>
        
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {sessions
            .filter(session => session.analytics && typeof session.analytics === 'object')
            .slice(0, 10)
            .map((session, index) => (
              <div
                key={session.sessionId}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                } ${selectedSession?.sessionId === session.sessionId ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedSession(selectedSession?.sessionId === session.sessionId ? null : session)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Session {sessions.length - index}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {formatDate(session.timestamp)} • {session.messages.length} messages
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Mode: {session.sessionMode} • Dominant: {session.analytics?.dominantEmotion || 'unknown'}
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    (session.analytics?.averageAdequacyScore || 0) > 0.7 
                      ? darkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'
                      : darkMode ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {Math.min(100, Math.round((session.analytics?.averageAdequacyScore || 0) * 100))}%
                  </div>
                </div>
                
                {selectedSession?.sessionId === session.sessionId && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>Messages:</strong>
                    </div>
                    <div className="space-y-1 mt-1">
                      {session.messages.slice(0, 3).map((msg, msgIndex) => (
                        <div key={msgIndex} className={`text-xs p-2 rounded ${
                          darkMode ? 'bg-gray-600' : 'bg-gray-100'
                        }`}>
                          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {msg.role === 'user' ? '👤 You' : '🤖 Assistant'}
                          </div>
                          <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {msg.content.length > 60 ? `${msg.content.substring(0, 60)}...` : msg.content}
                          </div>
                          {msg.emotionalState?.primaryAffect && (
                            <div className="mt-1">
                              <span className={`px-1 py-0.5 rounded text-xs text-white ${getEmotionColor(msg.emotionalState.primaryAffect)}`}>
                                {msg.emotionalState.primaryAffect}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                      {session.messages.length > 3 && (
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          +{session.messages.length - 3} more messages
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          {sessions.filter(session => session.analytics && typeof session.analytics === 'object').length === 0 && (
            <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No sessions with analytics data found
            </div>
          )}
        </div>
      </div>

      <button
        onClick={loadAnalytics}
        className={`w-full px-3 py-2 rounded text-sm transition-colors ${
          darkMode
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        🔄 Refresh Analytics
      </button>
    </div>
  )
} 