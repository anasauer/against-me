
import { getPlaceholderImage } from './placeholder-images';

export type Challenge = {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'daily' | 'weekly' | 'special';
  isCompleted: boolean;
  userId?: string;
  recurrence?: 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';
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

export const challenges: Challenge[] = [
    {
    id: '1',
    title: 'Un Mini-Espacio Limpio',
    description: 'Organizar una repisa, un cajón o el escritorio de trabajo.',
    points: 30,
    type: 'special',
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Hidratación',
    description: 'Tomar 2 litros de agua durante el día.',
    points: 20,
    type: 'daily',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Pausa Activa',
    description: 'Hacer 3 minutos de estiramiento.',
    points: 15,
    type: 'daily',
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Tareas Clave',
    description: 'Definir y agregar 3 tareas clave para la próxima semana.',
    points: 100,
    type: 'weekly',
    isCompleted: false,
  },
  {
    id: '5',
    title: 'Hora sin Pantallas',
    description: 'Pasa una hora antes de dormir sin pantallas',
    points: 30,
    type: 'daily',
    isCompleted: false,
  },
];

export const receivedChallenges: ReceivedChallenge[] = [
  {
    id: 'rc1',
    title: '¡Completa tu primer reto!',
    from: {
      name: 'Questify',
      avatar: getPlaceholderImage('questify-avatar')?.imageUrl ?? '',
      avatarHint: getPlaceholderImage('questify-avatar')?.imageHint ?? 'app logo',
    },
    reward: '150 puntos de bonificación',
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
    description: 'Pide cena de tu lugar favorito.',
    cost: 500,
  },
  {
    id: '4',
    title: '2hs de Pase Libre',
    description: 'Tómate unas horas libres de tareas, chicos y responsabilidades.',
    cost: 1000,
  },
];
