import { showHUD, Clipboard, getSelectedText, showToast, Toast, confirmAlert } from "@raycast/api";
import { getActiveTabDetails, openNewTabAndEnterText } from "./applescript";


const URL = "https://clarity.rahul.gs"

export default async function Command() {
  try {
    const result = await getActiveTabDetails()
    await openNewTabAndEnterText(URL, result.url)
    await Clipboard.copy(result.url);
    await showHUD("Pasted url in new tab input");
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: error.message ?? "An error occurred",
    });
  }
}

// export default async function Command() {
//   const result = await getSelectedText()
//   await openNewTabAndEnterText(URL, result)
//   await Clipboard.copy(result);
//   await showHUD("Copied main to clipboard");
// }
