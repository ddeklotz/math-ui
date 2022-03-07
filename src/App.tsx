import { Select } from '@mui/material';
import React, { useMemo } from 'react';
import './App.css';
import { Word } from './model';
// import * as json from './ujinumbers.json';
import { PenChar } from './PenChar';

const words = require('./ujinumbers.json') as Word[];

function App() {
  /*const words = useMemo(() => {
    const result: Word[] = [];
    for (const word of json) {
      result.push(word as Word);
    }
    return result;
  }, []);*/

  return (
    <div className="App">
      <header className="App-header">
        <Select
          label="chose a glyph"
          />  
        {
          words.slice(0, 5).map((word, index) => { return (
            <PenChar key={index} word={word}/>
          );})
        }
      </header>
    </div>
  );
}

export default App;
