export type AudioAction = 'add' | 'remove' | 'update';

export interface AudioInstruction {
  action: AudioAction;
  productToFind: string;
  quantity: number;
  unit: string;
}