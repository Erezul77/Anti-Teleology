import { collection, addDoc, Timestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebaseConfig';

export interface SessionData {
  sessionId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    adequacyScore?: any;
    emotionalState?: any;
    therapeuticStage?: string;
    onionLayer?: string;
    causalChain?: string[];
    detailedAnalysis?: string;
    realTimeAnalysis?: any;
  }>;
  timestamp: Date;
  sessionMode: 'coaching';
  language: string;
  analytics: {
    totalMessages: number;
    sessionDuration: number;
    averageAdequacyScore: number;
    dominantEmotion: string;
    userMessages: number;
    assistantMessages: number;
    therapeuticStages: string[];
    adequacyTrend: number[];
    emotionalTrend: string[];
  };
}

export class SessionManager {
  private static instance: SessionManager;

  private constructor() {}

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Save session to both localStorage and Firebase
  async saveSession(sessionData: SessionData): Promise<{ localStorage: boolean; firebase: boolean; firebaseId?: string }> {
    const results = {
      localStorage: false,
      firebase: false,
      firebaseId: undefined as string | undefined
    };

    // Save to localStorage
    try {
      const existingSessions = JSON.parse(localStorage.getItem('spino-sessions') || '[]');
      existingSessions.push(sessionData);
      
      // Keep only last 20 sessions
      if (existingSessions.length > 20) {
        existingSessions.splice(0, existingSessions.length - 20);
      }
      
      localStorage.setItem('spino-sessions', JSON.stringify(existingSessions));
      results.localStorage = true;
      console.log('✅ Session saved to localStorage:', sessionData.sessionId);
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }

    // Save to Firebase
    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id') {
        
        // Convert Date objects to Firestore Timestamps
        const firestoreData = {
          ...sessionData,
          timestamp: Timestamp.fromDate(sessionData.timestamp),
          messages: sessionData.messages.map(msg => ({
            ...msg,
            timestamp: Timestamp.fromDate(msg.timestamp)
          }))
        };

        const docRef = await addDoc(collection(db, 'sessions'), firestoreData);
        results.firebase = true;
        results.firebaseId = docRef.id;
        console.log('✅ Session saved to Firebase with ID:', docRef.id);
      } else {
        console.log('⚠️ Firebase not configured - skipping Firebase save');
      }
    } catch (error) {
      console.error('❌ Error saving to Firebase:', error);
    }

    return results;
  }

  // Load sessions from Firebase
  async loadSessionsFromFirebase(limitCount: number = 50): Promise<SessionData[]> {
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'your_project_id') {
        console.log('⚠️ Firebase not configured - cannot load from Firebase');
        return [];
      }

      const q = query(collection(db, 'sessions'), orderBy('timestamp', 'desc'), limit(limitCount));
      const querySnapshot = await getDocs(q);
      
      const sessions: SessionData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          ...data,
          timestamp: data.timestamp.toDate(),
          messages: data.messages.map((msg: any) => ({
            ...msg,
            timestamp: msg.timestamp.toDate()
          }))
        } as SessionData);
      });

      console.log(`✅ Loaded ${sessions.length} sessions from Firebase`);
      return sessions;
    } catch (error) {
      console.error('❌ Error loading from Firebase:', error);
      return [];
    }
  }

  // Load sessions from localStorage
  loadSessionsFromLocalStorage(): SessionData[] {
    try {
      const sessions = JSON.parse(localStorage.getItem('spino-sessions') || '[]');
      console.log(`✅ Loaded ${sessions.length} sessions from localStorage`);
      return sessions;
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
      return [];
    }
  }

  // Get analytics for all sessions
  async getSessionAnalytics(): Promise<{
    totalSessions: number;
    totalMessages: number;
    averageSessionLength: number;
    mostCommonEmotions: string[];
    adequacyTrend: number[];
    therapeuticStageDistribution: { [key: string]: number };
    recentSessions: SessionData[];
  }> {
    const firebaseSessions = await this.loadSessionsFromFirebase();
    const localStorageSessions = this.loadSessionsFromLocalStorage();
    
    // Combine and deduplicate sessions (prefer Firebase data)
    const allSessions = [...firebaseSessions, ...localStorageSessions];
    const uniqueSessions = this.deduplicateSessions(allSessions);

    const analytics = {
      totalSessions: uniqueSessions.length,
      totalMessages: uniqueSessions.reduce((sum, session) => sum + session.messages.length, 0),
      averageSessionLength: uniqueSessions.length > 0 
        ? uniqueSessions.reduce((sum, session) => sum + session.messages.length, 0) / uniqueSessions.length 
        : 0,
      mostCommonEmotions: this.getMostCommonEmotions(uniqueSessions),
      adequacyTrend: this.getAdequacyTrend(uniqueSessions),
      therapeuticStageDistribution: this.getTherapeuticStageDistribution(uniqueSessions),
      recentSessions: uniqueSessions.slice(0, 10)
    };

    return analytics;
  }

  private deduplicateSessions(sessions: SessionData[]): SessionData[] {
    const seen = new Set<string>();
    return sessions.filter(session => {
      if (seen.has(session.sessionId)) {
        return false;
      }
      seen.add(session.sessionId);
      return true;
    });
  }

  private getMostCommonEmotions(sessions: SessionData[]): string[] {
    const emotionCounts: { [key: string]: number } = {};
    
    sessions.forEach(session => {
      session.messages.forEach(message => {
        if (message.emotionalState?.primaryAffect) {
          const emotion = message.emotionalState.primaryAffect;
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        }
      });
    });

    return Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([emotion]) => emotion);
  }

  private getAdequacyTrend(sessions: SessionData[]): number[] {
    return sessions
      .flatMap(session => session.messages)
      .filter(message => message.adequacyScore?.unifiedScore !== undefined && message.adequacyScore?.unifiedScore !== null)
      .map(message => message.adequacyScore!.unifiedScore)
      .slice(-20); // Last 20 scores
  }

  private getTherapeuticStageDistribution(sessions: SessionData[]): { [key: string]: number } {
    const distribution: { [key: string]: number } = {};
    
    sessions.forEach(session => {
      session.messages.forEach(message => {
        if (message.therapeuticStage) {
          distribution[message.therapeuticStage] = (distribution[message.therapeuticStage] || 0) + 1;
        }
      });
    });

    return distribution;
  }
} 