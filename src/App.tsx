import { MenuItem, Select, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import './App.css';
import { Word } from './model';
// import * as json from './ujinumbers.json';
import { PenChar } from './PenChar';
import { dtw_word } from './recognition';

const words = require('./ujinumbers.json') as Word[];

function App() {
  const [leftGlyph, setLeftGlyph] = useState<number>();
  const [rightGlyph, setRightGlyph] = useState<number>();

  const score = useMemo(() => {
    if (leftGlyph === undefined || rightGlyph === undefined) {
      return undefined;
    }
    return dtw_word(words[leftGlyph], words[rightGlyph]);
  }, [leftGlyph, rightGlyph])

  return (
    <div className="App">
      <header className="App-header">
      </header>
        <div>
          <Typography>Score: {score ?? "n/a"}</Typography>
        </div>
        <Select
          label="chose left glyph"
          value={leftGlyph ?? ''}
          onChange={(event) => {setLeftGlyph(event?.target?.value as number)}}
          >
        {
          words.map((word, index) => {
            return (
              <MenuItem value={index} key={index}>{word.writer}: {word.character}</MenuItem>
            )
          })
        }
        </Select>
        <Select
          label="chose right glyph"
          value={rightGlyph ?? ''}
          onChange={(event) => {setRightGlyph(event?.target?.value as number)}}
          >
        {
          words.map((word, index) => {
            return (
              <MenuItem value={index} key={index}>{word.writer}: {word.character}</MenuItem>
            )
          })
        }
        </Select>
        <div>
          <Typography>left glyph</Typography>
          {
            leftGlyph && <PenChar word={words[leftGlyph]}/>
          }
        </div>
        <div>
          <Typography>right glyph</Typography>
          {
            rightGlyph && <PenChar word={words[rightGlyph]}/>
          }
        </div>
    </div>
  );
}

export default App;
