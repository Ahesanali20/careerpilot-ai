import * as pdfjsLib from "pdfjs-dist";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

type PositionedTextItem = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type VisualLine = {
  items: PositionedTextItem[];
  y: number;
};

function getVisualLines(items: PositionedTextItem[]): VisualLine[] {
  const sortedItems = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  const lines: VisualLine[] = [];

  for (const item of sortedItems) {
    const line = lines[lines.length - 1];
    const lineHeight = line
      ? Math.max(1, ...line.items.map((lineItem) => lineItem.height))
      : 1;
    const itemHeight = Math.max(1, item.height);
    const sameLineTolerance = Math.max(
      2,
      Math.min(lineHeight, itemHeight) * 0.35,
    );

    if (!line || Math.abs(line.y - item.y) > sameLineTolerance) {
      lines.push({ items: [item], y: item.y });
      continue;
    }

    line.items.push(item);
    line.y =
      line.items.reduce((total, lineItem) => total + lineItem.y, 0) /
      line.items.length;
  }

  return lines;
}

function joinLineItems(items: PositionedTextItem[]): string[] {
  const segments: string[] = [];
  let currentSegment = "";
  let previousItem: PositionedTextItem | undefined;

  for (const item of items) {
    if (!item.text) {
      previousItem = item;
      continue;
    }

    if (previousItem) {
      const gap = item.x - (previousItem.x + previousItem.width);
      const lineHeight = Math.max(previousItem.height, item.height, 1);
      const isColumnGap = gap > Math.max(32, lineHeight * 4);
      const hasSourceWhitespace =
        /\s$/.test(previousItem.text) || /^\s/.test(item.text);
      const needsSpace =
        !hasSourceWhitespace && gap > Math.max(1, lineHeight * 0.12);

      if (isColumnGap) {
        if (currentSegment.trim()) segments.push(currentSegment.trimEnd());
        currentSegment = item.text.trimStart();
        previousItem = item;
        continue;
      }

      if (needsSpace) currentSegment += " ";
    }

    currentSegment += item.text;
    previousItem = item;
  }

  if (currentSegment.trim()) segments.push(currentSegment.trim());
  return segments;
}

function isDecorativeRule(line: string): boolean {
  const trimmed = line.trim();
  return (
    trimmed.length >= 8 &&
    /^[\s_\-=—–─━|]+$/.test(trimmed) &&
    /[_\-=—–─━]{8,}/.test(trimmed)
  );
}

function splitSectionHeadings(line: string): string[] {
  const headingStartPattern =
    /(?:^|(?<=[.!?]\s))((?:[A-Z][A-Z0-9&/+.-]*)(?:\s+[A-Z][A-Z0-9&/+.-]*){0,5})(?=\s+(?:[A-Z][a-z]|[•●▪*-]))/g;
  const parts: string[] = [];
  let start = 0;

  for (const match of line.matchAll(headingStartPattern)) {
    const heading = match[1].trim();
    if (heading.length < 7) continue;

    const headingStart = match.index! + match[0].lastIndexOf(heading);
    const headingEnd = headingStart + heading.length;
    if (/^\s+[A-Z][a-z]+:/.test(line.slice(headingEnd))) continue;

    const prefix = line.slice(start, headingStart).trim();

    if (prefix) parts.push(prefix);
    parts.push(heading);
    start = headingEnd;
  }

  const suffix = line.slice(start).trim();
  if (suffix) parts.push(suffix);
  return parts.length > 0 ? parts : [line.trim()];
}

function isStandaloneHeading(text: string): boolean {
  return (
    text.length <= 60 &&
    /[A-Z]/.test(text) &&
    /^[A-Z0-9&/+.-]+(?:\s+[A-Z0-9&/+.-]+)*$/.test(text)
  );
}

export async function extractPdfText(file: File): Promise<string> {
  const pdfData = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: pdfData,
  }).promise;

  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    const items = textContent.items.flatMap((item) => {
      if (!("str" in item)) {
        return [];
      }

      return [
        {
          text: item.str,
          x: item.transform[4] ?? 0,
          y: item.transform[5] ?? 0,
          width: item.width,
          height: Math.max(
            Math.abs(item.height),
            Math.abs(item.transform[3] ?? 0),
          ),
        },
      ];
    });

    const visualLines = getVisualLines(items);
    const lineRecords = visualLines.flatMap((visualLine) => {
      const height = Math.max(
        1,
        ...visualLine.items.map((item) => item.height),
      );

      return joinLineItems(visualLine.items)
        .filter((line) => !isDecorativeRule(line))
        .flatMap((line) =>
          splitSectionHeadings(line).map((text) => ({
            text,
            y: visualLine.y,
            height,
            isHeading: text !== line || isStandaloneHeading(text),
          })),
        );
    });

    const pageText = lineRecords.reduce(
      (result, line, index) => {
        const previous = lineRecords[index - 1];
        if (!previous) return line.text;

        const verticalGap = Math.abs(previous.y - line.y);
        const hasParagraphGap =
          verticalGap > Math.max(previous.height, line.height) * 1.55;
        const addBlankLine =
          line.isHeading || previous.isHeading || hasParagraphGap;

        return `${result}${addBlankLine ? "\n\n" : "\n"}${line.text}`;
      },
      "",
    );

    pages.push(pageText);
  }

  return pages.join("\n\n").trim();
}
