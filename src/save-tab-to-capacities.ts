import { showHUD, getSelectedText, showToast, Toast, confirmAlert } from "@raycast/api";
import { getActiveTabDetails } from "./applescript";
import { SafariTabProps } from "./types";
import { runAppleScript } from "run-applescript";

export default async function Command() {
    try {
        const activeTab = await getActiveTabDetails() as SafariTabProps
        let content = `[${activeTab.url}](${activeTab.url})`

        try {
            const selectedText = await getSelectedText()
            if (selectedText) content = content + `\n\n> ${selectedText}`
        } catch (e) {
        }

        const title = `Raycast Save ${(new Date()).toLocaleString()}`

        const url = `capacities://x-callback-url/createNewObject?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}&tags=${encodeURIComponent("[test]")}`
        await runAppleScript(`do shell script "shortcuts run OpenURL <<< \\"${url}\\""`)

        await showHUD("Saved to Capacities");
    } catch (error) {
        await showToast({
            style: Toast.Style.Failure,
            title: error.message ?? "An error occurred",
        });
    }
}