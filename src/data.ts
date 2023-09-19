import { Glyph } from "./model";
import { scale, applyToPoints, Matrix, translate } from "transformation-matrix";
import { dtw_glyph } from "./recognition";

const glyphs = require("./glyphs.json") as Glyph[];

export const allGlyphs = glyphs;

function getRandomEntry<T>(list: T[]): T | undefined {
  if (list.length === 0) {
    return undefined; // Return undefined if the list is empty
  }

  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

const orderGlyphsByClass = (glyphs: Glyph[]): Record<string, Glyph[]> => {
  const result: Record<string, Glyph[]> = {};
  for (const g of glyphs) {
    if (result[g.character] === undefined) {
      result[g.character] = [];
    }
    result[g.character].push(g);
  }
  return result;
};

export const generateIncompleteGlyphs = (originalGlyphs: Glyph[]): Glyph[] => {
  const result: Glyph[] = [];
  const glyphsByClass = orderGlyphsByClass(originalGlyphs);

  for (const gc of ["4", "5"]) {
    for (const glyph of glyphsByClass[gc]) {
      result.push({
        writer: glyph.writer,
        character: "none",
        repetition: 0,
        strokes: glyph.strokes.slice(0, 1),
      });
    }
  }

  return result;
};

// Glyphs that include the last stroke of one glyph and the first stroke of another glyph
// are useful for training examples of strokes that don't make a glyph together.
export const generateSplitGlyphs = (
  originalGlyphs: Glyph[],
  examplesOfEach: number,
): Glyph[] => {
  const result: Glyph[] = [];
  const glyphsByClass = orderGlyphsByClass(originalGlyphs);

  const classes = Object.keys(glyphsByClass);
  for (const leftClass of classes) {
    for (const rightClass of classes) {
      // console.log(`left=${leftClass}, right=${rightClass}`);
      for (let i = 0; i < examplesOfEach; ++i) {
        const leftGlyph = getRandomEntry(glyphsByClass[leftClass]);
        const rightGlyph = getRandomEntry(glyphsByClass[rightClass]);
        if (leftGlyph && rightGlyph) {
          const startStroke = leftGlyph.strokes[leftGlyph.strokes.length - 1];
          const endStroke = rightGlyph.strokes[0];

          const leftBox = findGlyphBoundingBox(leftGlyph);
          const rightBox = findGlyphBoundingBox(rightGlyph);

          const translatedEndStroke = applyToPoints(
            translate(
              -rightBox.x + (leftBox.x + leftBox.width) + 0.2,
              -rightBox.y + leftBox.y,
            ),
            endStroke,
          );

          result.push({
            character: /*`not ${leftClass} or ${rightClass}`*/ "none",
            writer: leftGlyph.writer,
            repetition: 0,
            strokes: [startStroke, translatedEndStroke],
          });
        }
      }
    }
  }

  return result;
};

const transformGlyph = (glyph: Glyph, transform: Matrix) => {
  return {
    ...glyph,
    strokes: glyph.strokes.map((stroke) => {
      return applyToPoints(transform, stroke);
    }),
  };
};

const sum = (a: number, b: number) => a + b;

export const findCenter = (glyph: Glyph): [number, number] => {
  const strokes = glyph.strokes.flat();

  return [
    (strokes.map((a) => a[0]).reduce(sum, 0) * 1.0) / strokes.length,
    (strokes.map((a) => a[1]).reduce(sum, 0) * 1.0) / strokes.length,
  ];
};

export const stroke_findTopLeft = (
  stroke: [number, number][],
): [number, number] => {
  return [
    Math.min(...stroke.map((a) => a[0])),
    Math.min(...stroke.map((a) => a[1])),
  ];
};

export const stroke_findBottomRight = (
  stroke: [number, number][],
): [number, number] => {
  return [
    Math.max(...stroke.map((a) => a[0])),
    Math.max(...stroke.map((a) => a[1])),
  ];
};

export const findTopLeft = (glyph: Glyph): [number, number] => {
  return stroke_findTopLeft(glyph.strokes.flat());
};

export const findBottomRight = (glyph: Glyph): [number, number] => {
  return stroke_findBottomRight(glyph.strokes.flat());
};

export const findBoundingBox = (
  stroke: [number, number][],
): { x: number; y: number; width: number; height: number } => {
  const [leftX, topY] = stroke_findTopLeft(stroke);
  const [rightX, bottomY] = stroke_findBottomRight(stroke);

  return {
    x: leftX,
    y: topY,
    width: rightX - leftX,
    height: bottomY - topY,
  };
};

export const findGlyphBoundingBox = (
  glyph: Glyph,
): { x: number; y: number; width: number; height: number } => {
  return findBoundingBox(glyph.strokes.flat());
};

// our needs for UI display are not exactly a bounding box, and this code assumes the glyph has been normalized already.
export const findDisplayBoundingBox = (
  glyph: Glyph,
): { x: number; y: number; s: number } => {
  const [leftX, topY] = findTopLeft(glyph);
  const [rightX, bottomY] = findBottomRight(glyph);

  const width = rightX - leftX;
  const height = bottomY - topY;

  if (height > width) {
    return {
      x: leftX - (height - width) * 0.5,
      y: topY,
      s: 1,
    };
  } else {
    return {
      x: leftX,
      y: topY - (width - height) * 0.5,
      s: 1,
    };
  }
};

export const justify = (glyph: Glyph): Glyph => {
  const [centerX, centerY] = findCenter(glyph);

  return transformGlyph(glyph, translate(-centerX, -centerY));
};

export const normalize = (glyph: Glyph): Glyph => {
  const strokes = glyph.strokes.flat();

  const xCoords = strokes.map((a) => a[0]);
  const yCoords = strokes.map((a) => a[1]);

  const scalefactor =
    1.0 /
    Math.max(
      Math.max(...yCoords) - Math.min(...yCoords),
      Math.max(...xCoords) - Math.min(...xCoords),
    );

  return transformGlyph(glyph, scale(scalefactor));
};

export const correctSlant = (glyph: Glyph): Glyph => {
  return transformGlyph(glyph, scale(2)); // JUST A TEST
};

export const preprocess = (glyph: Glyph): Glyph => {
  return normalize(justify(glyph));
};

export const glyphDescription = (glyph: Glyph) =>
  `${glyph.writer}: ${glyph.character} rep${glyph.repetition}`;

export const classify = (glyph: Glyph, candidates: Glyph[]) => {
  return candidates
    .filter((g) => g.writer !== glyph.writer)
    .map((candidate) => {
      const distance = dtw_glyph(glyph, candidate);
      return {
        glyph: candidate,
        distance,
      };
    })
    .sort((a, b) => a.distance - b.distance);
};

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
