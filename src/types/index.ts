export interface Theme {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  code: string;
}

export interface UserData {
  name: string;
  age: string;
  message: string;
}

export interface ValidationErrors {
  name?: string;
  age?: string;
  message?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'error' | 'success';
}

export type AppStep = 'form' | 'payment' | 'loading' | 'complete';