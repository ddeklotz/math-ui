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

export const justify = (glyph: Glyph): Glyph => {
  const minX = Math.min(...glyph.strokes.flat().map(a => a[0]));
  const minY = Math.min(...glyph.strokes.flat().map(a => a[1]));

  return transformGlyph(glyph, translate(-minX, -minY));
};

export const correctSlant = (glyph: Glyph): Glyph => {

  return transformGlyph(glyph, scale(2)) // JUST A TEST
}
