import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Verb {
  id: number;
  infinitiv: string;
  praeteritum: string;
  partizip_ii: string;
  hilfsverb: 'haben' | 'sein';
  sonderformen_praesens: string[];
  translation_fr: string;
  set_id: number;
  group_label: string;
  notes?: string;
}

interface AppState {
  // Authentification
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Verbes
  verbs: Verb[];
  currentVerb: Verb | null;

  // Actions
  setUser: (user: User | null, token: string | null) => void;
  logout: () => void;
  setVerbs: (verbs: Verb[]) => void;
  setCurrentVerb: (verb: Verb | null) => void;
}

// Récupérer les données depuis localStorage au démarrage
const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const useAppStore = create<AppState>((set) => ({
  // État initial - restaurer depuis localStorage
  user: getStoredUser(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  verbs: [],
  currentVerb: null,

  // Actions
  setUser: (user, token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }

    set({ user, token, isAuthenticated: !!token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false, verbs: [], currentVerb: null });
  },

  setVerbs: (verbs) => set({ verbs }),

  setCurrentVerb: (verb) => set({ currentVerb: verb }),
}));
