
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { Glyph } from '../model';
import { PenChar } from '../PenChar';
import { dtw_word } from '../recognition';

const glyphs = (require('../ujinumbers.json') as Glyph[]).slice(0, 100);

export const DTWPage: React.FC = () => {
  const [leftGlyph, setLeftGlyph] = useState<number>();
  const [rightGlyph, setRightGlyph] = useState<number>();

  const score = useMemo(() => {
    if (leftGlyph === undefined || rightGlyph === undefined) {
      return undefined;
    }
    return dtw_word(glyphs[leftGlyph], glyphs[rightGlyph]);
  }, [leftGlyph, rightGlyph])

  return (
    <div className="App">
      <header className="App-header">
      </header>
        <div>
          <Typography>Score: {score ?? "n/a"}</Typography>
        </div>
        <FormControl fullWidth>
          <InputLabel id="left-glyph-label">left glyph</InputLabel>
          <Select
            labelId='left-glyph-label'
            label="left glyph"
            value={leftGlyph ?? ''}
            onChange={(event) => {setLeftGlyph(event?.target?.value as number)}}
            >
          {
            glyphs.map((word, index) => {
              return (
                <MenuItem value={index} key={index}>{word.writer}: {word.character}</MenuItem>
              )
            })
          }
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="right-glyph-label">right glyph</InputLabel>
          <Select
            labelId='right-glyph-label'
            label="right glyph"
            value={rightGlyph ?? ''}
            onChange={(event) => {setRightGlyph(event?.target?.value as number)}}
            >
          {
            glyphs.map((word, index) => {
              return (
                <MenuItem value={index} key={index}>{word.writer}: {word.character}</MenuItem>
              )
            })
          }
          </Select>
        </FormControl>
        <div>
          <Typography>left glyph</Typography>
          {
            (leftGlyph !== undefined) && <PenChar glyph={glyphs[leftGlyph]}/>
          }
        </div>
        <div>
          <Typography>right glyph</Typography>
          {
            (rightGlyph !== undefined) && <PenChar glyph={glyphs[rightGlyph]}/>
          }
        </div>
    </div>
  );
};
