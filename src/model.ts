export type Stroke = [number, number][];

export interface Word {
  character: string;
  writer: string;
  repetition: number;
  strokes: Stroke[];
}
