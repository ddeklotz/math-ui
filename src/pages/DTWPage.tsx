import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { FixedSizeList } from "react-window";
import { allGlyphs, classify, preprocess } from "../data";
import { GlyphCard, PenChar } from "../PenChar";

const glyphs = allGlyphs.map(preprocess);

export const DTWPage: React.FC = () => {
  const [leftGlyph, setLeftGlyph] = useState<number>();

  const candidates = useMemo(() => {
    if (leftGlyph === undefined) {
      return [];
    }
    return classify(glyphs[leftGlyph], glyphs);
  }, [leftGlyph]);

  const glyphOptions = glyphs.map((o, index) => {
    return {
      label: `${o.writer}: ${o.character} ${o.repetition}`,
      index,
    };
  });

  const renderRow = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const candidate = candidates[index];
    return (
      <div style={style}>
        <Typography>difference: {candidate.distance}</Typography>
        <GlyphCard glyph={candidate.glyph} />
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <Autocomplete
        id="select-left-glyph"
        style={{ width: 300, margin: 15 }}
        disableListWrap
        options={glyphOptions}
        value={leftGlyph !== undefined ? glyphOptions[leftGlyph] : null}
        onChange={(_event, newValue) =>
          setLeftGlyph(newValue?.index ?? undefined)
        }
        renderInput={(params) => <TextField {...params} label="select glyph" />}
      />
      <div>
        {leftGlyph !== undefined && (
          <div>
            <Typography>selected glyph</Typography>
            <PenChar glyph={glyphs[leftGlyph]} />
            <Typography>candidates</Typography>
            <div>
              <FixedSizeList
                height={500 ?? 0}
                width={500 ?? 0}
                itemSize={250}
                itemCount={candidates.length}
                overscanCount={5}
              >
                {renderRow}
              </FixedSizeList>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
