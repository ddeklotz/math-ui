import { MenuItem, Select, Typography } from '@mui/material';
import React, { useState } from 'react';
import './App.css';
import { Word } from './model';
// import * as json from './ujinumbers.json';
import { PenChar } from './PenChar';

const words = require('./ujinumbers.json') as Word[];

function App() {
  const [leftGlyph, setLeftGlyph] = useState<number>();
  const [rightGlyph, setRightGlyph] = useState<number>();

  return (
    <div className="App">
      <header className="App-header">
        <Select
          label="chose left glyph"
          value={leftGlyph || ''}
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
          value={rightGlyph || ''}
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
      </header>
    </div>
  );
}

export default App;
