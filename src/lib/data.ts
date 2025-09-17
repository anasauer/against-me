import { getPlaceholderImage } from './placeholder-images';

export type Challenge = {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'daily' | 'weekly' | 'special';
  isCompleted: boolean;
};

export type Reward = {
  id: string;
  title: string;
  description: string;
  cost: number;
};

export type Activity = {
  id: string;
  user: {
    name: string;
    avatar: string;
    avatarHint: string;
  };
  action: string;
  timestamp: string;
};

export const user = {
  name: 'Alex',
  avatar: getPlaceholderImage('user-avatar-main')?.imageUrl || '',
  avatarHint: getPlaceholderImage('user-avatar-main')?.imageHint || '',
  points: 1250,
  dailyStreak: 5,
  weeklyStreak: 2,
};

export const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Morning Run',
    description: 'Run 5km in the morning',
    points: 50,
    type: 'daily',
    isCompleted: true,
  },
  {
    id: '2',
    title: 'Read a Chapter',
    description: 'Read one chapter of a book',
    points: 20,
    type: 'daily',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Meal Prep for the Week',
    description: 'Prepare all your meals for the upcoming week',
    points: 200,
    type: 'weekly',
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Learn a New Skill',
    description: 'Spend 1 hour learning a new skill online',
    points: 100,
    type: 'special',
    isCompleted: false,
  },
  {
    id: '5',
    title: 'No-Screen Hour',
    description: 'Spend one hour before bed without any screens',
    points: 30,
    type: 'daily',
    isCompleted: true,
  },
];

export const rewards: Reward[] = [
  {
    id: '1',
    title: 'Movie Night',
    description: 'Redeem for a movie night with popcorn',
    cost: 300,
  },
  {
    id: '2',
    title: 'New Video Game',
    description: 'A new game of your choice',
    cost: 2500,
  },
  {
    id: '3',
    title: 'Takeout Dinner',
    description: 'Order dinner from your favorite restaurant',
    cost: 500,
  },
  {
    id: '4',
    title: 'Day Off',
    description: 'Take a day off from all chores',
    cost: 1000,
  },
];

export const activities: Activity[] = [
  {
    id: '1',
    user: {
      name: 'Jessica',
      avatar: getPlaceholderImage('jessica-avatar')?.imageUrl || '',
      avatarHint: getPlaceholderImage('jessica-avatar')?.imageHint || '',
    },
    action: 'completed "Morning Run" challenge and earned 50 points.',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    user: {
      name: 'Mark',
      avatar: getPlaceholderImage('mark-avatar')?.imageUrl || '',
      avatarHint: getPlaceholderImage('mark-avatar')?.imageHint || '',
    },
    action: 'redeemed the "Movie Night" reward.',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    user: {
      name: 'You',
      avatar: user.avatar,
      avatarHint: user.avatarHint,
    },
    action: 'created a new challenge "Meal Prep for the Week".',
    timestamp: 'Yesterday',
  },
  {
    id: '4',
    user: {
      name: 'Samantha',
      avatar: getPlaceholderImage('samantha-avatar')?.imageUrl || '',
      avatarHint: getPlaceholderImage('samantha-avatar')?.imageHint || '',
    },
    action: 'completed a 7-day streak!',
    timestamp: 'Yesterday',
  },
];
