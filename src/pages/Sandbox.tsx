import React from "react";
import { allGlyphs, correctSlant } from "../data";
import { PenChar } from "../PenChar";

export const Sandbox: React.FC = () => {
  return (
    <div>
      <PenChar glyph={correctSlant(allGlyphs[0])} />
    </div>
  );
};
