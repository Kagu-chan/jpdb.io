export interface IActivatable {
  name: string;
  category: string;
  experimental?: boolean;
  displayText?: string;
  description?: string;
  author?: string;
  source?: string;
  children?: unknown[];
}
