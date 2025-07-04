import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatApiResponse(rawText: any) {
  if (typeof rawText !== "string") {
    // Ensure the input is a string; return empty if not.
    return "";
  }

  let formattedText = rawText;

  // 1. Convert Markdown bolding (e.g., **text**) to HTML <strong> tags.
  // This regex finds text enclosed by double asterisks.
  formattedText = formattedText.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  // 2. Convert Markdown headings (e.g., # Heading, ## Subheading) to HTML heading tags.
  // The `gm` flags enable global (all matches) and multiline (start of line `^`) matching.
  formattedText = formattedText.replace(/^###\s(.*?)$/gm, "<h3>$1</h3>");
  formattedText = formattedText.replace(/^##\s(.*?)$/gm, "<h2>$1</h2>");
  formattedText = formattedText.replace(/^#\s(.*?)$/gm, "<h1>$1</h1>");

  const hasHtmlLineBreaks = /<br\s*\/?>/i.test(formattedText);

  if (!hasHtmlLineBreaks) {
    formattedText = formattedText.replace(/\n\n/g, "<br><br>");
    formattedText = formattedText.replace(/\n/g, "<br>");
  }

  return formattedText;
}
