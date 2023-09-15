import React, { useState } from "react"
import { useResizeDetector } from "react-resize-detector"
import { FixedSizeList } from 'react-window'
import { Glyph } from "../model";
import { allGlyphs, preprocess } from "../data"
import { GlyphCard } from "../PenChar"

import "./ListPage.scss"

const character_classes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '=', '<', '>'];

const initialGlyphs: Glyph[] = allGlyphs.map(preprocess);

export interface GlyphListProps {
  shouldFilterByClass: boolean;
  selectedGlyphClass: string;
  shouldFilterByStrokes: boolean;
  selectedNumStrokes: string;
  glyphs: Glyph[];
  setGlyphs: (v: Glyph[]) => void;
}

export const GlyphList: React.FC<GlyphListProps> = ({
  shouldFilterByClass,
  selectedGlyphClass,
  shouldFilterByStrokes,
  selectedNumStrokes,
  glyphs,
  setGlyphs
}) => {
  let renderedGlyphs = glyphs;
  
  renderedGlyphs = shouldFilterByClass ?
    renderedGlyphs.filter(g => g.character === selectedGlyphClass) :
    renderedGlyphs;

  renderedGlyphs = shouldFilterByStrokes ?
    renderedGlyphs.filter(g => g.strokes.length.toString() === selectedNumStrokes) :
    renderedGlyphs;
  
  const renderRow = ({index, style}: {index: number, style: React.CSSProperties}) => {
    return (
      <div style={style}>
        <GlyphCard glyph={renderedGlyphs[index]}
          onRemove={() => {
            setGlyphs(glyphs.filter(g => g != renderedGlyphs[index]));
          }
        } />
      </div>
    )
  }

  const { ref, width, height } = useResizeDetector()

  return (
    <div className="list" ref={ref}>
      <FixedSizeList
        height={height ? height : 0}
        width={width ?? 0}
        itemSize={200}
        itemCount={renderedGlyphs.length}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  )
}

export const ListPage: React.FC = () => {
  const [shouldFilterByClass, setShouldFilterByClass] = useState(false);
  const [selectedGlyphClass, setSelectedGlyphClass] = useState('0');
  const [shouldFilterByStrokes, setShouldFilterByStrokes] = useState(false);
  const [selectedNumStrokes, setSelectedNumStrokes] = useState('0');
  const [outputFileName, setOutputFileName] = useState('examples.json');
  const [glyphs, setGlyphs] = useState<Glyph[]>(initialGlyphs);

  // Map all the unique number of strokes in the dataset
  let strokeCountMap: { [key: string]: boolean } = {};
  glyphs.forEach(g => strokeCountMap[g.strokes.length.toString()] = true);

  const strokeCountArray = Object.keys(strokeCountMap);
  if (strokeCountArray.length > 0 && !strokeCountMap[selectedNumStrokes]) {
    setSelectedNumStrokes(strokeCountArray[0]);
  }
  
  return (
    <div className="list-page">
      <div className="filter-controls">
        <label>
          <input
            type="checkbox"
            checked={shouldFilterByClass}
            onChange={e => setShouldFilterByClass(e.target.checked)}
          />
          Filter examples by class: 
        </label>
        <select
          className="class-dropdown"
          value={selectedGlyphClass}
          onChange={e => setSelectedGlyphClass(e.target.value)}>
            {character_classes.map(c => <option value={c}>{c}</option>)}
        </select>
        <br></br>
        <label>
          <input
            type="checkbox"
            checked={shouldFilterByStrokes}
            onChange={e => setShouldFilterByStrokes(e.target.checked)}
          />
          Filter examples by number of strokes: 
        </label>
        <select
          className="class-dropdown"
          value={selectedNumStrokes}
          onChange={e => setSelectedNumStrokes(e.target.value)}>
            {strokeCountArray.map(c => <option value={c}>{c}</option>)}
        </select>
      </div>
      <div className="export-controls">
        <label>Output filename:</label>
        <input
          type="text"
          value={outputFileName}
          onChange={e => setOutputFileName(e.target.value)}
        />
        <button
          onClick={() => {
            const jsonData = JSON.stringify(glyphs, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = outputFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }>Export</button>
      </div>

      <GlyphList
        shouldFilterByClass={shouldFilterByClass}
        selectedGlyphClass={selectedGlyphClass}
        shouldFilterByStrokes={shouldFilterByStrokes}
        selectedNumStrokes={selectedNumStrokes}
        glyphs={glyphs}
        setGlyphs={setGlyphs}
      />
    </div>
  );
};
