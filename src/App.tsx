import React, { useMemo } from 'react';
import './App.css';
// import * as json from './ujinumbers.json';
import { PenChar, Word } from './PenChar';

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
        {
          words.map((word, index) => { return (
            <PenChar key={index} word={word}/>
          );})
        }
      </header>
    </div>
  );
}

export default App;
