export interface ChatSource {
  title: string;
  url: string;
  excerpt: string;
  origin?: 'niser' | 'web';
}

export type ChatMode = 'niser' | 'web' | 'general' | 'none';
