import { FixCallback, FixFn } from '../css.types';

export const betaPlugin: FixFn = (fn: FixCallback): void =>
  fn(
    'beta-plugin',
    `
.beta {
  color: var(--outline-v1-color);
  font-weight: bold;
  cursor: pointer;
  display: inline-block;
  font-size: 1.0rem;
  line-height: 2.0rem;
  padding: 0 .5rem;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
}`,
  );
