export type GadgetType = 'icon' | 'paddle' | 'ball' | 'trails' | 'barrier' | 'effects';

export type DisplayType = 'image' | 'color'

export interface IGadget {
  _id: string;
  type: GadgetType;
  data: string;
  displayType: DisplayType;
}

export type SelectedGadgets = { [_ in GadgetType]?: IGadget };