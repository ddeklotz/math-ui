import { Glyph } from "./model";
import { scale, applyToPoints, Matrix, translate } from 'transformation-matrix';
import { dtw_glyph } from "./recognition";

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

export const findBottomRight = (glyph: Glyph): [number, number] => {
  const strokes = glyph.strokes.flat()

  return [
    Math.max(...strokes.map(a => a[0])),
    Math.max(...strokes.map(a => a[1]))
  ];
}

export const findBoundingBox = (glyph: Glyph): {x: number, y: number, s: number} => {
  const [leftX, topY] = findTopLeft(glyph);
  const [rightX, bottomY] = findBottomRight(glyph);

  const width = rightX - leftX;
  const height = bottomY - topY;

  if (height > width) {
    return {
      x: leftX - (height - width) * .5,
      y: topY,
      s: 1
    };
  } else {
    return {
      x: leftX,
      y: topY - (width - height) * .5,
      s: 1
    };
  }
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

export const glyphDescription = (glyph: Glyph) => `${glyph.writer}: ${glyph.character} rep${glyph.repetition}`

export const classify = (glyph: Glyph, candidates: Glyph[]) => {
  return candidates
    .filter(g => g.writer !== glyph.writer)
    .map(candidate => {
      const distance = dtw_glyph(glyph, candidate);
      return {
        glyph: candidate,
        distance
      };
    })
    .sort((a, b) => a.distance - b.distance);
}

/*export const classifyAll = (glyphs: Glyph[]) => {
    return glyphs.map(glyph => {
        console.log(`classifying ${glyphDescription(glyph)}`)
        return glyphs
          .filter(g => g.writer !== glyph.writer)
          .map(candidate => {
            const distance = dtw_glyph(glyph, candidate);
            return {
              glyph: candidate,
              distance
            };
          })
          .sort((a, b) => a.distance - b.distance)
      });
}*/