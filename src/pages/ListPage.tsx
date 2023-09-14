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
}

export const GlyphList: React.FC<GlyphListProps> = ({ shouldFilterByClass, selectedGlyphClass }) => {
  const [glyphs, setGlyphs] = useState<Glyph[]>(initialGlyphs);

  const renderedGlyphs =
    shouldFilterByClass ?
      glyphs.filter(g => g.character === selectedGlyphClass) :
      glyphs;

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
  
  return (
    <div className="list-page">
      <div className="filter-controls">
        <label>
          <input
            type="checkbox"
            name="showCheckbox"
            id="showCheckbox"
            checked={shouldFilterByClass}
            onChange={e => setShouldFilterByClass(e.target.checked)}
          />
          Filter examples by class: 
        </label>
        <select
          className="class-dropdown"
          value={selectedGlyphClass}
          onChange={e => setSelectedGlyphClass(e.target.value)}>
            {
              character_classes.map(c =>
                <option value={c}>{c}</option>
              )
            }
        </select>
      </div>

      <GlyphList
        shouldFilterByClass={shouldFilterByClass}
        selectedGlyphClass={selectedGlyphClass} />
    </div>
  );
};
