import { ModuleUserOption } from '../../../module-options.type';
import { Renderer } from './_renderer';

export abstract class ListRenderer<
  TOption extends ModuleUserOption = ModuleUserOption,
  TVal = unknown,
> extends Renderer<TOption, TVal[]> {}
