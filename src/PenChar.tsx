import { Typography } from '@mui/material';
import { typography } from '@mui/system';
import React, { useMemo } from 'react';
import { findCenter } from './data';
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

const scale = 100;

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
  const lines = useMemo(() => {
    const result: Line[] = [];

    for (const stroke of props.glyph.strokes) {
      for (let i = 0; i < stroke.length - 1; ++i) {
        result.push({
          start: stroke[i],
          end: stroke[i + 1]
        });
      }
    }

    return result;
  }, [props.glyph.strokes]);

  //const center = [0, 0]; findCenter(props.glyph);
  const center = findCenter(props.glyph);
  console.log(center)

  return (
    <div className="pen-char">
      <svg height="200" width="200">
        {
          lines.map((line, index) => {
            return (
              <line key={index} x1={(line.start[0] + center[0])*scale} y1={(line.start[1] + center[1])*scale} x2={(line.end[0] + center[0])*scale} y2={(line.end[1] + center[1])*scale} stroke="black" strokeWidth="2"/>
            )
          })
        }
      </svg>
    </div>
  );
}
