// Stage 4V — Collaboration system with presence, ghost cursors, comments, reviews

export interface User {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

export interface UserPresence {
  user: User;
  position: { x: number; y: number };
  timestamp: number;
  isActive: boolean;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  position: { x: number; y: number };
  timestamp: number;
  replies: Comment[];
  resolved: boolean;
  reviewState: 'open' | 'approved' | 'rejected';
}

export interface CollaborationRoom {
  id: string;
  name: string;
  users: Set<string>;
  presence: Map<string, UserPresence>;
  comments: Comment[];
  settings: {
    allowComments: boolean;
    allowPresence: boolean;
    requireApproval: boolean;
  };
}

export interface CollaborationMessage {
  type: 'presence' | 'comment' | 'review' | 'join' | 'leave';
  userId: string;
  data: any;
  timestamp: number;
}

export class CollaborationManager {
  private rooms: Map<string, CollaborationRoom> = new Map();
  private currentUser: User | null = null;
  private messageHandlers: Map<string, (message: CollaborationMessage) => void> = new Map();
  private presenceUpdateInterval: number | null = null;
  
  constructor() {
    this.setupMessageHandlers();
  }
  
  setCurrentUser(user: User): void {
    this.currentUser = user;
  }
  
  createRoom(roomId: string, name: string, settings: Partial<CollaborationRoom['settings']> = {}): CollaborationRoom {
    const room: CollaborationRoom = {
      id: roomId,
      name,
      users: new Set(),
      presence: new Map(),
      comments: [],
      settings: {
        allowComments: true,
        allowPresence: true,
        requireApproval: false,
        ...settings
      }
    };
    
    this.rooms.set(roomId, room);
    return room;
  }
  
  joinRoom(roomId: string): boolean {
    if (!this.currentUser) {
      console.error('No current user set');
      return false;
    }
    
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`Room ${roomId} not found`);
      return false;
    }
    
    room.users.add(this.currentUser.id);
    
    // Send join message
    this.broadcastMessage(roomId, {
      type: 'join',
      userId: this.currentUser.id,
      data: { user: this.currentUser },
      timestamp: Date.now()
    });
    
    // Start presence updates if enabled
    if (room.settings.allowPresence && !this.presenceUpdateInterval) {
      this.startPresenceUpdates(roomId);
    }
    
    return true;
  }
  
  leaveRoom(roomId: string): boolean {
    if (!this.currentUser) return false;
    
    const room = this.rooms.get(roomId);
    if (!room) return false;
    
    room.users.delete(this.currentUser.id);
    room.presence.delete(this.currentUser.id);
    
    // Send leave message
    this.broadcastMessage(roomId, {
      type: 'leave',
      userId: this.currentUser.id,
      data: { user: this.currentUser },
      timestamp: Date.now()
    });
    
    // Stop presence updates if no users left
    if (room.users.size === 0 && this.presenceUpdateInterval) {
      this.stopPresenceUpdates();
    }
    
    return true;
  }
  
  updatePresence(roomId: string, position: { x: number; y: number }): void {
    if (!this.currentUser) return;
    
    const room = this.rooms.get(roomId);
    if (!room || !room.settings.allowPresence) return;
    
    const presence: UserPresence = {
      user: this.currentUser,
      position,
      timestamp: Date.now(),
      isActive: true
    };
    
    room.presence.set(this.currentUser.id, presence);
    
    // Broadcast presence update
    this.broadcastMessage(roomId, {
      type: 'presence',
      userId: this.currentUser.id,
      data: { presence },
      timestamp: Date.now()
    });
  }
  
  addComment(roomId: string, content: string, position: { x: number; y: number }): Comment | null {
    if (!this.currentUser) return null;
    
    const room = this.rooms.get(roomId);
    if (!room || !room.settings.allowComments) return null;
    
    const comment: Comment = {
      id: this.generateId(),
      user: this.currentUser,
      content,
      position,
      timestamp: Date.now(),
      replies: [],
      resolved: false,
      reviewState: 'open'
    };
    
    room.comments.push(comment);
    
    // Broadcast comment
    this.broadcastMessage(roomId, {
      type: 'comment',
      userId: this.currentUser.id,
      data: { comment },
      timestamp: Date.now()
    });
    
    return comment;
  }
  
  replyToComment(roomId: string, commentId: string, content: string): Comment | null {
    if (!this.currentUser) return null;
    
    const room = this.rooms.get(roomId);
    if (!room) return null;
    
    const parentComment = room.comments.find(c => c.id === commentId);
    if (!parentComment) return null;
    
    const reply: Comment = {
      id: this.generateId(),
      user: this.currentUser,
      content,
      position: parentComment.position,
      timestamp: Date.now(),
      replies: [],
      resolved: false,
      reviewState: 'open'
    };
    
    parentComment.replies.push(reply);
    
    // Broadcast reply
    this.broadcastMessage(roomId, {
      type: 'comment',
      userId: this.currentUser.id,
      data: { comment: reply, parentId: commentId },
      timestamp: Date.now()
    });
    
    return reply;
  }
  
  updateCommentReviewState(roomId: string, commentId: string, state: Comment['reviewState']): boolean {
    if (!this.currentUser) return false;
    
    const room = this.rooms.get(roomId);
    if (!room) return false;
    
    const comment = room.comments.find(c => c.id === commentId);
    if (!comment) return false;
    
    comment.reviewState = state;
    
    // Broadcast review state change
    this.broadcastMessage(roomId, {
      type: 'review',
      userId: this.currentUser.id,
      data: { commentId, state },
      timestamp: Date.now()
    });
    
    return true;
  }
  
  resolveComment(roomId: string, commentId: string): boolean {
    if (!this.currentUser) return false;
    
    const room = this.rooms.get(roomId);
    if (!room) return false;
    
    const comment = room.comments.find(c => c.id === commentId);
    if (!comment) return false;
    
    comment.resolved = true;
    
    // Broadcast resolution
    this.broadcastMessage(roomId, {
      type: 'comment',
      userId: this.currentUser.id,
      data: { commentId, resolved: true },
      timestamp: Date.now()
    });
    
    return true;
  }
  
  getRoom(roomId: string): CollaborationRoom | undefined {
    return this.rooms.get(roomId);
  }
  
  getActiveUsers(roomId: string): User[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    
    return Array.from(room.users).map(userId => {
      const presence = room.presence.get(userId);
      return presence?.user || { id: userId, name: 'Unknown', color: '#666' };
    });
  }
  
  getPresence(roomId: string): UserPresence[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    
    return Array.from(room.presence.values());
  }
  
  getComments(roomId: string): Comment[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    
    return room.comments;
  }
  
  private setupMessageHandlers(): void {
    this.messageHandlers.set('presence', (message) => {
      const room = this.findRoomByUser(message.userId);
      if (room) {
        room.presence.set(message.userId, message.data.presence);
      }
    });
    
    this.messageHandlers.set('comment', (message) => {
      const room = this.findRoomByUser(message.userId);
      if (room) {
        if (message.data.parentId) {
          // Reply to existing comment
          const parentComment = room.comments.find(c => c.id === message.data.parentId);
          if (parentComment) {
            parentComment.replies.push(message.data.comment);
          }
        } else {
          // New comment
          room.comments.push(message.data.comment);
        }
      }
    });
    
    this.messageHandlers.set('review', (message) => {
      const room = this.findRoomByUser(message.userId);
      if (room) {
        const comment = room.comments.find(c => c.id === message.data.commentId);
        if (comment) {
          comment.reviewState = message.data.state;
        }
      }
    });
    
    this.messageHandlers.set('join', (message) => {
      const room = this.findRoomByUser(message.userId);
      if (room) {
        room.users.add(message.userId);
      }
    });
    
    this.messageHandlers.set('leave', (message) => {
      const room = this.findRoomByUser(message.userId);
      if (room) {
        room.users.delete(message.userId);
        room.presence.delete(message.userId);
      }
    });
  }
  
  private findRoomByUser(userId: string): CollaborationRoom | undefined {
    for (const room of this.rooms.values()) {
      if (room.users.has(userId)) {
        return room;
      }
    }
    return undefined;
  }
  
  private startPresenceUpdates(roomId: string): void {
    this.presenceUpdateInterval = window.setInterval(() => {
      // Update presence as active
      const room = this.rooms.get(roomId);
      if (room && this.currentUser) {
        const presence = room.presence.get(this.currentUser.id);
        if (presence) {
          presence.isActive = true;
          presence.timestamp = Date.now();
        }
      }
    }, 30000); // Update every 30 seconds
  }
  
  private stopPresenceUpdates(): void {
    if (this.presenceUpdateInterval) {
      clearInterval(this.presenceUpdateInterval);
      this.presenceUpdateInterval = null;
    }
  }
  
  private broadcastMessage(roomId: string, message: CollaborationMessage): void {
    // In a real implementation, this would send to a WebSocket server
    // For now, we'll just log it
    console.log(`Broadcasting to room ${roomId}:`, message);
    
    // Handle the message locally
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    }
  }
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  
  destroy(): void {
    this.stopPresenceUpdates();
    this.rooms.clear();
    this.messageHandlers.clear();
  }
}
