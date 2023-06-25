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

export function parseArrayFromString(input: string) {
    const regex = new RegExp(`([^,}]+)`, 'g');
    const matches = input.match(regex);

    if (matches) {
        return matches.map((match) => match.trim());
    }

    return [];
}

export function parseJSON(jsonString: string): object {
    const fixedString = jsonString.replace(/(?<={|,)\s*([^:]+?)\s*:/g, ' "$1":')
    return JSON.parse(fixedString);
}
