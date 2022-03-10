import { Typography } from '@mui/material';
import { typography } from '@mui/system';
import React, { useMemo } from 'react';
import { applyToPoints, compose, translate, scale, applyToPoint } from 'transformation-matrix';
import { findTopLeft } from './data';
import { Glyph } from './model';
import "./PenChar.scss";

export interface PenCharProps {
  glyph: Glyph;
}

type Point = [number, number];

interface Line {
  start: Point;
  end: Point;
}

const scalefactor = 100;

export const GlyphCard: React.FC<PenCharProps> = ({glyph}) => {
  return (
    <div className="glyph-card">
      <div className="glyph-text">
        <Typography>
          {glyph.writer}
        </Typography>
        <Typography>
          {glyph.character} {glyph.repetition}
        </Typography>
      </div>
      <div>
        <PenChar glyph={glyph} />
      </div>
    </div>
  )
}

export const PenChar: React.FC<PenCharProps> = (props) => {

  // transform the points to svg space  
  const renderTransform = useMemo(() => {
    const topleft = findTopLeft(props.glyph);
    return compose(
      translate(10, 10),
      scale(scalefactor),
      translate(-topleft[0], -topleft[1])
    );
  }, [props.glyph.strokes]);

  const lines = useMemo(() => {
    const result: Line[] = [];
    for (const stroke of props.glyph.strokes) {
      const transformedStroke = applyToPoints(renderTransform, stroke);
      for (let i = 0; i < transformedStroke.length - 1; ++i) {
        result.push({
          start: transformedStroke[i],
          end: transformedStroke[i + 1]
        });
      }
    }

    return result;
  }, [props.glyph.strokes, renderTransform]);

  const center = applyToPoint(renderTransform, [0, 0]);
  const width = 200;
  const height = 200;
    
  return (
    <div className="pen-char">
      <svg height={height} width={width}>
        <line key="x-axis" x1="0" x2={width} y1={center[1]} y2={center[1]} stroke="red" strokeWidth="1" />
        <line key="x-axis" x1={center[0]} x2={center[0]} y1="0" y2={height} stroke="red" strokeWidth="1" />
        {
          lines.map((line, index) => {
            return (
              <line key={index} x1={line.start[0]} y1={line.start[1]} x2={line.end[0]} y2={line.end[1]} stroke="black" strokeWidth="2"/>
            )
          })
        }
      </svg>
    </div>
  );
}
