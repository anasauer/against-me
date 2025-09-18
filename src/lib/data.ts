
import { getPlaceholderImage } from './placeholder-images';

export type Challenge = {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'daily' | 'weekly' | 'special';
  isCompleted: boolean;
};

export type ReceivedChallenge = {
  id: string;
  title: string;
  from: {
    name: string;
    avatar: string;
    avatarHint: string;
  };
  reward: string;
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
  shareActivity: true,
};

export const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Carrera Matutina',
    description: 'Corre 5km por la mañana',
    points: 50,
    type: 'daily',
    isCompleted: true,
  },
  {
    id: '2',
    title: 'Leer un Capítulo',
    description: 'Leer un capítulo de un libro',
    points: 20,
    type: 'daily',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Preparar Comida para la Semana',
    description: 'Prepara todas tus comidas para la próxima semana',
    points: 200,
    type: 'weekly',
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Aprender una Nueva Habilidad',
    description: 'Pasa 1 hora aprendiendo una nueva habilidad en línea',
    points: 100,
    type: 'special',
    isCompleted: false,
  },
  {
    id: '5',
    title: 'Hora sin Pantallas',
    description: 'Pasa una hora antes de dormir sin pantallas',
    points: 30,
    type: 'daily',
    isCompleted: true,
  },
];

export const receivedChallenges: ReceivedChallenge[] = [
  {
    id: 'rc1',
    title: 'Ganarme en una partida de ajedrez',
    from: {
      name: 'Jessica',
      avatar: getPlaceholderImage('jessica-avatar')?.imageUrl || '',
      avatarHint: getPlaceholderImage('jessica-avatar')?.imageHint || '',
    },
    reward: 'Te invito a cenar',
  },
];


export const rewards: Reward[] = [
  {
    id: '1',
    title: 'Un helado',
    description: 'Canjea por un helado de tu sabor favorito.',
    cost: 300,
  },
  {
    id: '2',
    title: 'Auto-regalo de hasta $30.000',
    description: 'Cómprate algo que quieras, ¡te lo mereces!',
    cost: 2500,
  },
  {
    id: '3',
    title: 'Cena',
    description: 'Pide cena de tu restaurante favorito.',
    cost: 500,
  },
  {
    id: '4',
    title: '2hs de Pase Libre',
    description: 'Tómate unas horas libres de tareas, chicos y responsabilidades.',
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
    action: 'completó el reto "Carrera Matutina" y ganó 50 puntos.',
    timestamp: 'Hace 2 horas',
  },
  {
    id: '2',
    user: {
      name: 'Mark',
      avatar: getPlaceholderImage('mark-avatar')?.imageUrl || '',
      avatarHint: getPlaceholderImage('mark-avatar')?.imageHint || '',
    },
    action: 'canjeó la recompensa "Noche de Película".',
    timestamp: 'Hace 5 horas',
  },
  {
    id: '3',
    user: {
      name: 'Tú',
      avatar: user.avatar,
      avatarHint: user.avatarHint,
    },
    action: 'creó un nuevo reto "Preparar Comida para la Semana".',
    timestamp: 'Ayer',
  },
  {
    id: '4',
    user: {
      name: 'Samantha',
      avatar: getPlaceholderImage('samantha-avatar')?.imageUrl || '',
      avatarHint: getPlaceholderImage('samantha-avatar')?.imageHint || '',
    },
    action: '¡completó una racha de 7 días!',
    timestamp: 'Ayer',
  },
];
