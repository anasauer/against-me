
export type UserProfile = {
  name: string;
  email?: string;
  avatar: string;
  points: number;
  dailyStreak: number;
  weeklyStreak: number;
  friends?: string[];
  hasCompletedOnboarding?: boolean;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'daily' | 'weekly' | 'special';
  isCompleted: boolean;
  userId?: string;
  recurrence?: 'none' | 'daily' | 'weekly' | 'biweekly' | 'thrice-weekly' | 'monthly';
};

export type FriendRequest = {
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: any; // Firestore Timestamp
};
