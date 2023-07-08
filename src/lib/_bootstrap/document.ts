export {};

declare global {
  interface Document {
    jpdb: {
      id: number;
    };
  }
}

document.jpdb = { id: 0 };
