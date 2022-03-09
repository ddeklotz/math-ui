export type Stroke = [number, number][];

export interface Glyph {
  character: string;
  writer: string;
  repetition: number;
  strokes: Stroke[];
}
