export type GadgetType = 'icon' | 'paddle' | 'ball' | 'trails' | 'barrier' | 'effects';

export interface Gadget {
  id: number;
  name: string;
  type: GadgetType;
  icon: string;
}