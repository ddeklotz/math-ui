import { Stroke, Word } from "./model";

const sum = (a: number, b: number) => a + b;

export const dtw_segment = (left: Stroke, right: Stroke)  => {
  // the DP solution matrix
  const DTW = new Array((left.length + 1) * (right.length + 1));
  const dtw_idx = (idx_l: number, idx_r: number) => left.length * (idx_r + 1) + (idx_l + 1);

  DTW[0] = 0;
  for (let i = 0; i < left.length; i++) {
    DTW[dtw_idx(i, -1)] = 0;
  }
  for (let i = 0; i < right.length; i++) {
    DTW[dtw_idx(-1, i)] = 0;
  }

  for (let i = 0; i < left.length; i++) {
    for (let j = 0; j < left.length; j++) {
      const dx = left[i][0] - right[i][0];
      const dy = left[i][1] - right[i][1];
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

export const dtw_word = (left: Word, right: Word): number => {
  const strokes = Math.min(left.strokes.length, right.strokes.length);
  // can't really compare a real stroke to a totally empty stroke, because
  // that doesn't leave any room for the DP result table. Instead we just
  // provide one distant point.

  console.log(left);
  console.log(right);

  const emptyStroke: Stroke = [[100000, 100000]];
  const result = Array(Math.max(left.strokes.length, right.strokes.length))
    .map((_, idx) => dtw_segment(left.strokes[idx] || [], right.strokes[idx] || emptyStroke))
    .reduce(sum, 0);

  return result;
}
