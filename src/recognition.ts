import { Stroke, Glyph } from "./model";

export const dtw_segment = (left: Stroke, right: Stroke)  => {
  // the DP solution matrix
  const DTW = new Array((left.length + 1) * (right.length + 1));
  const dtw_idx = (idx_l: number, idx_r: number) => (left.length + 1) * (idx_r + 1) + (idx_l + 1);

  DTW[0] = 0;
  for (let i = 0; i < left.length; i++) {
    DTW[dtw_idx(i, -1)] = 0;
  }
  for (let i = 0; i < right.length; i++) {
    DTW[dtw_idx(-1, i)] = 0;
  }

  for (let i = 0; i < left.length; i++) {
    for (let j = 0; j < right.length; j++) {
      const dx = left[i][0] - right[j][0];
      const dy = left[i][1] - right[j][1];
      const cost = Math.sqrt(dx * dx + dy * dy);

      DTW[dtw_idx(i, j)] = cost + Math.min(
        DTW[dtw_idx(i - 1, j - 1)], // match
        DTW[dtw_idx(i - 1, j)],     // insert (skip left)
        DTW[dtw_idx(i, j - 1)]      // delete (skip right)
      );
    }
  }
  return DTW[dtw_idx(left.length - 1, right.length - 1)];
}

export const dtw_glyph = (left: Glyph, right: Glyph): number => {
  // can't really compare a real stroke to a totally empty stroke, because
  // that doesn't leave any room for the DP result table. Instead we just
  // provide one distant point.
  const emptyStroke: Stroke = [[100000, 100000]];
  
  let sum = 0;
  for (let i = 0; i < Math.max(left.strokes.length, right.strokes.length); i++) {
    sum += dtw_segment(left.strokes[i] ?? emptyStroke, right.strokes[i] ?? emptyStroke);
  }
  return sum;
}
