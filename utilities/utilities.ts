import * as fs from "fs";

export type Stroke = [number, number][];

export interface Glyph {
  character: string;
  writer: string;
  repetition: number;
  strokes: Stroke[];
}

async function readFileAsJSON(filePath: string): Promise<object | null> {
  try {
    const fileContents = await fs.promises.readFile(filePath, "utf-8");
    const jsonObject = JSON.parse(fileContents);
    return jsonObject;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}

async function writeJSONToFile(
  filePath: string,
  jsonObject: object,
): Promise<void> {
  try {
    const jsonString = JSON.stringify(jsonObject, null, 2);
    await fs.promises.writeFile(filePath, jsonString, "utf-8");
    console.log("JSON object successfully written to file:", filePath);
  } catch (error) {
    console.error("Error writing JSON object to file:", error);
  }
}

const convertFile = async (filename: string, updatedFilename: string) => {
  const data = (await readFileAsJSON(filename)) as [number, number][][][];
  const glyphs: Glyph[] = data.map((g, idx) => ({
    character: `char ${idx}`,
    writer: " ",
    repetition: 0,
    strokes: g,
  }));

  await writeJSONToFile(updatedFilename, glyphs);
};

const addRepetition = async (filename: string, outfilename: string) => {
  const data = (await readFileAsJSON(filename)) as Glyph[];

  const counts: Record<string, number> = {};

  for (const glyph of data) {
    glyph.repetition = counts[glyph.character] ?? 1;
    counts[glyph.character] = glyph.repetition + 1;
  }

  await writeJSONToFile(outfilename, data);
};

addRepetition(
  "C:\\creative\\strokes\\glyphs.json",
  "C:\\creative\\strokes\\glyphs_with_repetition.json",
);

//convertFile("./data.json", "./glyphs_data.json").then(() => {console.log("all done")});
