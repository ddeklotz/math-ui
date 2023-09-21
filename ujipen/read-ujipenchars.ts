//var fs = require('fs');
import * as fs from "fs";

type Stroke = [number, number][];

interface Word {
  character: string;
  writer: string;
  repetition: number;
  strokes: Stroke[];
}

const parseUJIStroke = (line: string): Stroke => {
  const [_, numbersection] = line.split(" # ");
  const numbers = numbersection.split(" ").map((n) => parseInt(n, 10));
  if (numbers.length % 2 !== 0) {
    throw new Error("odd number of coordinate pieces");
  }

  const result: Stroke = [];
  for (let i = 0; i < numbers.length; i += 2) {
    result.push([numbers[i], numbers[i + 1]]);
  }
  return result;
};

const parseUJIWord = (startingline: string, lines: string[]): Word => {
  const [_, character, sessionid] = startingline.split(" ");
  const [writer, repetition] = sessionid.split("-");

  const numstrokesLine = lines.shift()!.trim();

  const [_2, numstrokes] = numstrokesLine.split(" ");
  const strokeCount = parseInt(numstrokes);
  const strokes: Stroke[] = [];
  for (let i = 0; i < strokeCount; ++i) {
    strokes.push(parseUJIStroke(lines.shift()!));
  }

  return {
    character,
    writer,
    repetition: parseInt(repetition),
    strokes,
  };
};

const parseUJIWords = (lines: string[]): Word[] => {
  const words: Word[] = [];
  for (let line = lines.shift(); line; line = lines.shift()) {
    if (line.startsWith("WORD")) {
      words.push(parseUJIWord(line, lines));
    }
  }

  return words;
};

try {
  const filename = process.argv[2];
  var data = fs.readFileSync(filename, "utf8");
  const lines = data.split("\n");
  const words = parseUJIWords(lines);

  const desiredChars: Set<string> = new Set([
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ]);

  const kept = words.filter((w) => desiredChars.has(w.character));

  console.log(`kept ${kept.length} chars`);
  console.log(JSON.stringify(kept));
} catch (e) {
  console.log("Error:", e.stack);
}
