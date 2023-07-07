export {};

declare global {
  interface Document {
    _id: number;
  }
}

document._id = 0;
