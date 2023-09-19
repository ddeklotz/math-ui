import { Typography } from "@mui/material";
import React, { useMemo } from "react";
import {
  applyToPoints,
  compose,
  translate,
  scale,
  applyToPoint,
} from "transformation-matrix";
import { findDisplayBoundingBox } from "./data";
import { Glyph } from "./model";
import "./PenChar.scss";

export interface GlyphCardProps {
  glyph: Glyph;
  onRemove?: () => void;
}

export interface PenCharProps {
  glyph: Glyph;
}

type Point = [number, number];

interface Line {
  start: Point;
  end: Point;
}

const scalefactor = 100;

export const GlyphCard: React.FC<GlyphCardProps> = ({ glyph, onRemove }) => {
  return (
    <div className="glyph-card">
      <div className="glyph-properties">
        <Typography>
          Writer = {glyph.writer.trim() === "" ? "?" : glyph.writer}
        </Typography>
        <Typography>Character = {glyph.character}</Typography>
        <Typography>Repetition = {glyph.repetition}</Typography>
        <Typography>Number of strokes = {glyph.strokes.length}</Typography>
      </div>
      <div className="glyph-plot">
        <PenChar glyph={glyph} />
      </div>
      <div className="glyph-options">
        <button onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
};

const offset = [10, 10];

export const PenChar: React.FC<PenCharProps> = (props) => {
  // transform the points to svg space
  const renderTransform = useMemo(() => {
    const boundingBox = findDisplayBoundingBox(props.glyph);
    return compose(
      translate(offset[0], offset[1]),
      scale(scalefactor),
      translate(-boundingBox.x, -boundingBox.y),
    );
  }, [props.glyph.strokes]);

  const lines = useMemo(() => {
    const result: Line[] = [];
    for (const stroke of props.glyph.strokes) {
      const transformedStroke = applyToPoints(renderTransform, stroke);
      for (let i = 0; i < transformedStroke.length - 1; ++i) {
        result.push({
          start: transformedStroke[i],
          end: transformedStroke[i + 1],
        });
      }
    }

    return result;
  }, [props.glyph.strokes, renderTransform]);

  const center = applyToPoint(renderTransform, [0, 0]);
  const width = 140;
  const height = 140;

  return (
    <div className="pen-char">
      <svg height={height} width={width}>
        <line
          key="x-axis"
          x1="0"
          x2={width}
          y1={center[1]}
          y2={center[1]}
          stroke="red"
          strokeWidth="1"
        />
        <line
          key="y-axis"
          x1={center[0]}
          x2={center[0]}
          y1="0"
          y2={height}
          stroke="red"
          strokeWidth="1"
        />
        <rect
          x={offset[0]}
          y={offset[1]}
          width={scalefactor}
          height={scalefactor}
          stroke="black"
          strokeWidth="1"
          fill="none"
        />
        {lines.map((line, index) => {
          return (
            <line
              key={index}
              x1={line.start[0]}
              y1={line.start[1]}
              x2={line.end[0]}
              y2={line.end[1]}
              stroke="black"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    </div>
  );
};
