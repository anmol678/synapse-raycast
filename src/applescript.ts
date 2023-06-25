import { runAppleScript } from "run-applescript"
import { convertSafariStringToJson } from "./utils"
import { SafariTabProps } from "./types"

export async function performSafariAction(actionScript: string, humanReadableOutput: boolean = true) {
    let script = `
        tell application "System Events"
            set activeApp to name of first application process whose frontmost is true
        end tell

        if activeApp is equal to "Safari" then
            tell application "Safari"
                ${actionScript}
            end tell
        else
            error
        end if
    `

    try {
        return await runAppleScript(script, { humanReadableOutput })
    } catch (e) {
        throw new Error("This command is only available for Safari")
    }
}

// Knowledge Management Extensions

export async function getActiveTabDetails(): Promise<SafariTabProps> {
    let script = `
        set theURL to URL of front document
        set theHTML to do JavaScript "document.body.innerText" in front document
        return {url: theURL, html: theHTML}
    `

    let result = await performSafariAction(script)
    return convertSafariStringToJson(result)
}

export async function openNewTabAndEnterText(url: string, text: string) {
    let script = `
        tell application "Safari"
            set originalTab to current tab of front window
            make new tab at end of tabs of front window with properties {URL: "${url}"}
            delay 2  -- Wait for the page to load. You might need to adjust this delay.
            set current tab of front window to originalTab
            do JavaScript "document.querySelector('input').value = \`${text}\`" in last tab of front window
        end tell
    `

    await runAppleScript(script)
}
