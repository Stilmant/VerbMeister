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

export const useAppStore = create<AppState>((set) => ({
  // État initial
  user: null,
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
    set({ user, token, isAuthenticated: !!token });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setVerbs: (verbs) => set({ verbs }),

  setCurrentVerb: (verb) => set({ currentVerb: verb }),
}));
