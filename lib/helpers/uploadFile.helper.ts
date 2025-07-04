// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// // Configure worker for Node.js environment
// pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve(
//   "pdfjs-dist/legacy/build/pdf.worker.mjs"
// );

// export async function extractFormattedText(pdfBuffer: Buffer | Uint8Array) {
//   try {
//     const data =
//       pdfBuffer instanceof Buffer ? new Uint8Array(pdfBuffer) : pdfBuffer;

//     const pdfDoc = await pdfjsLib.getDocument({
//       data,
//       standardFontDataUrl: undefined, // Disable font loading in Node.js
//       verbosity: 0, // Reduce console output
//     }).promise;

//     let formattedText = "";

//     for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
//       const page = await pdfDoc.getPage(pageNum);
//       const textContent = await page.getTextContent() as any;

//       const sortedItems = textContent.items.sort((a: any, b: any) => {
//         const yDiff = b.transform[5] - a.transform[5];
//         if (Math.abs(yDiff) > 5) {
//           return yDiff;
//         }
//         return a.transform[4] - b.transform[4];
//       });

//       let currentY: number | null = null;
//       let lineText = "";

//       for (const item of sortedItems) {
//         const itemY = item.transform[5];

//         if (currentY !== null && Math.abs(currentY - itemY) > 5) {
//           if (lineText.trim()) {
//             formattedText += lineText.trim() + "\n";
//           }
//           lineText = "";
//         }

//         lineText += item.str;
//         currentY = itemY;
//       }

//       if (lineText.trim()) {
//         formattedText += lineText.trim() + "\n";
//       }

//       formattedText += "\n";
//     }

//     return formattedText;
//   } catch (error) {
//     console.error("Error extracting formatted text:", error);
//     throw error;
//   }
// }

export async function parseFileAsText(
  extractedText: string,
  userInput: string
) {
  const MODIFIED_PROMPT = `Act as a data enginner, You have to parse the user information, act based on the user input.
    User Input: ${userInput}
    Act upon this extracted text.
    Extracted Prompt: ${extractedText}
    `;

  return MODIFIED_PROMPT;
}
