import React, { useCallback } from "react"
import { useResizeDetector } from "react-resize-detector"
import { FixedSizeList } from 'react-window'
import { allGlyphs } from "../data"
import { PenChar } from "../PenChar"

import "./ListPage.scss"

export const GlyphList: React.FC = () => {

  const renderRow = ({index, style}: {index: number, style: React.CSSProperties}) => {
    return (
      <div style={style}>
        <PenChar glyph={allGlyphs[index]} />
      </div>
    )
  }

  const { ref, width, height } = useResizeDetector()

  return (
    <div className="list" ref={ref}>
      <FixedSizeList
        height={height ?? 0}
        width={width ?? 0}
        itemSize={300}
        itemCount={allGlyphs.length}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  )
}

export const ListPage: React.FC = () => {
  return (
    <div className="list-page">
      <GlyphList />
    </div>
  );
}
