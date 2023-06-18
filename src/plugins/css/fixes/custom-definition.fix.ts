import { FixCallback, FixFn } from '../css.types';

export const customDefinitionFix: FixFn = (fn: FixCallback): void =>
  fn(
    'custom-definitions',
    `.custom-definition > p {
  white-space: pre-wrap;
}`,
  );
