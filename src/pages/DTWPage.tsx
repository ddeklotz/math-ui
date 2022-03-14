
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { allGlyphs, preprocess } from '../data';
import { Glyph } from '../model';
import { PenChar } from '../PenChar';
import { dtw_word } from '../recognition';

const glyphs = allGlyphs.map(preprocess)

export const DTWPage: React.FC = () => {
  const [leftGlyph, setLeftGlyph] = useState<number>();
  const [rightGlyph, setRightGlyph] = useState<number>();

  const score = useMemo(() => {
    if (leftGlyph === undefined || rightGlyph === undefined) {
      return undefined;
    }
    return dtw_word(glyphs[leftGlyph], glyphs[rightGlyph]);
  }, [leftGlyph, rightGlyph])

  const glyphOptions = glyphs.map((o, index) => {
    return {
      label: `${o.writer}: ${o.character} ${o.repetition}`,
      index
    }
  });

  return (
    <div className="App">
      <header className="App-header">
      </header>
        <div>
          <Typography>Score: {score ?? "n/a"}</Typography>
        </div>
        <Autocomplete
          id="select-left-glyph"
          style={{width: 300, margin:15}}
          disableListWrap
          options={glyphOptions}
          value={leftGlyph !== undefined ? glyphOptions[leftGlyph] : null}
          onChange={(_event, newValue) => setLeftGlyph(newValue?.index ?? undefined)}
          renderInput={(params) => <TextField {...params} label="left glyph" />}
          />
        <Autocomplete
          id="select-right-glyph"
          style={{width: 300, margin:15}}
          disableListWrap
          options={glyphOptions}
          value={rightGlyph !== undefined ? glyphOptions[rightGlyph] : null}
          onChange={(_event, newValue) => setRightGlyph(newValue?.index ?? undefined)}
          renderInput={(params) => <TextField {...params} label="right glyph" />}
          />
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
