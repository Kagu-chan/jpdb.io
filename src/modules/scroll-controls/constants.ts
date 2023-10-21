import { ScrollControlOrder, ScrollControlPosition } from './types';

export const SCROLL_CONTROLS: string = 'ScrollControls';

export const ScrollControlOrderLabels: Record<ScrollControlOrder, string> = {
  [ScrollControlOrder.BT]: 'Bottom -> Top',
  [ScrollControlOrder.TB]: 'Top -> Bottom',
};

export const ScrollControlPositionLabels: Record<ScrollControlPosition, string> = {
  [ScrollControlPosition.L]: 'Left',
  [ScrollControlPosition.R]: 'Right',
  [ScrollControlPosition.B]: 'Left and Right',
};
