import pdfParse from "pdf-parse";

export async function extractRawText(file: any) {
  const pdfData = await pdfParse(file?.buffer);
  return pdfData.text as string;
}

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
