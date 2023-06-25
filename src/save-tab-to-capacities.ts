import { showHUD, getSelectedText, showToast, Toast, confirmAlert } from "@raycast/api";
import { getActiveTabDetails, openCapacitiesURLInBackground } from "./applescript";
import { SafariTabProps } from "./types";

async function composeXCallbackURL() {
    const sourceApp = `x-source=Raycast&x-success=raycast://extensions&x-error=raycast://extensions`

    const activeTab = await getActiveTabDetails() as SafariTabProps
    let content = `[${activeTab.url}](${activeTab.url})`

    try {
        const selectedText = await getSelectedText()
        if (selectedText) content = content + `\n\n> ${selectedText}`
    } catch (e) {
    }

    const title = `Raycast Save ${(new Date()).toLocaleString()}`

    const url = `capacities://x-callback-url/createNewObject?${sourceApp}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`

    return url
}

export default async function Command() {
    try {
        const url = await composeXCallbackURL()
        await openCapacitiesURLInBackground(url);
        await showHUD("Saved to Capacities");
    } catch (error) {
        await showToast({
            style: Toast.Style.Failure,
            title: error.message ?? "An error occurred",
        });
    }
}