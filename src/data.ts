import { Glyph } from "./model";
import { scale, applyToPoints, Matrix, translate } from 'transformation-matrix';

const glyphs = (require('./ujinumbers.json') as Glyph[]);

export const allGlyphs = glyphs;

const transformGlyph = (glyph: Glyph, transform: Matrix) => {
  return {
    ...glyph,
    strokes: glyph.strokes.map(stroke => {
      return applyToPoints(transform, stroke)
    })
  };
}

const sum = (a: number, b: number) => a + b;

export const findCenter = (glyph: Glyph): [number, number] => {
  const strokes = glyph.strokes.flat()

  return [
    strokes.map(a => a[0]).reduce(sum, 0) * 1.0 / strokes.length,
    strokes.map(a => a[1]).reduce(sum, 0) * 1.0 / strokes.length
  ];
}

export const findTopLeft = (glyph: Glyph): [number, number] => {
  const strokes = glyph.strokes.flat()

  return [
    Math.min(...strokes.map(a => a[0])),
    Math.min(...strokes.map(a => a[1]))
  ];
}

export const justify = (glyph: Glyph): Glyph => {
  const [centerX, centerY] = findCenter(glyph);

  return transformGlyph(glyph, translate(-centerX, -centerY));
};

export const normalize = (glyph: Glyph): Glyph => {
  const strokes = glyph.strokes.flat();

  const xCoords = strokes.map(a => a[0]);
  const yCoords = strokes.map(a => a[1]);
  
  const scalefactor = 1.0 / Math.max(
    Math.max(...yCoords) - Math.min(...yCoords),
    Math.max(...xCoords) - Math.min(...xCoords)
  );
  
  return transformGlyph(glyph, scale(scalefactor))
}

export const correctSlant = (glyph: Glyph): Glyph => {

  return transformGlyph(glyph, scale(2)) // JUST A TEST
}

export const preprocess = (glyph: Glyph): Glyph => {
  return normalize(justify(glyph))
}