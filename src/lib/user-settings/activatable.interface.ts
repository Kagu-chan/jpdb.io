export interface IActivatable {
  name: string;
  category: string;
  displayText?: string;
  description?: string;
  author?: string;
  source?: string;
  children?: unknown[];
}
