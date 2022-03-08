import React, { useMemo } from 'react';
import { Word } from './model';
import "./PenChar.scss";

export interface PenCharProps {
  word: Word;
}

type Point = [number, number];

interface Line {
  start: Point;
  end: Point;
}

const scale = .1;

export const PenChar: React.FC<PenCharProps> = (props) => {
  const lines = useMemo(() => {
    const result: Line[] = [];

    for (const stroke of props.word.strokes) {
      for (let i = 0; i < stroke.length - 1; ++i) {
        result.push({
          start: stroke[i],
          end: stroke[i + 1]
        });
      }
    }

    return result;
  }, [props.word.strokes]);

  return (
    <div className="pen-char">
      <svg height="200" width="200">
        {
          lines.map((line, index) => {
            return (
              <line key={index} x1={line.start[0]*scale} y1={line.start[1]*scale} x2={line.end[0]*scale} y2={line.end[1]*scale} stroke="black" strokeWidth="2"/>     
            )
          })
        }
      </svg>
    </div>
  );
}
