import React, { useCallback } from "react"
import { useResizeDetector } from "react-resize-detector"
import { FixedSizeList } from 'react-window'
import { allWords } from "../data"

import "./ListPage.scss"

export const GlyphList: React.FC = () => {

  const renderRow = ({index, style}: {index: number, style: React.CSSProperties}) => {
    return (
      <div style={style}>
        Item {index}
      </div>
    )
  }

  const { ref, width, height } = useResizeDetector()

  return (
    <div className="list" ref={ref}>
      my width is {width ?? "not known"}, my height is {height ?? "not known"}
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

/*
      <FixedSizeList
        height={1000}
        width={500}
        itemSize={300}
        itemCount={allWords.length}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
      */