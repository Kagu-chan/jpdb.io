export interface ScrollTarget {
  text: string;
  fn: (e: MouseEvent) => void;
}

export const up: ScrollTarget = {
  text: '⮝',
  fn: (e: Event): void => {
    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  },
};
export const down: ScrollTarget = {
  text: '⮟',
  fn: (e: Event): void => {
    e.preventDefault();

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  },
};
