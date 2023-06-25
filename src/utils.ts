import { SafariTabProps } from "./types";

export function convertSafariStringToJson(input: string): SafariTabProps {
    const urlRegex = /URL:\s*(.*?),/;
    const htmlRegex = /html:\s*([\s\S]*)/;

    const urlMatch = input.match(urlRegex);
    const htmlMatch = input.match(htmlRegex);

    if (urlMatch && htmlMatch) {
        const url = urlMatch[1].trim();
        const html = htmlMatch[1].trim();
        return { url, html };
    }

    throw new Error('Invalid input string format');
}
