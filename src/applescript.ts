import { runAppleScript } from "run-applescript"
import { convertSafariStringToJson, parseArrayFromString } from "./utils"
import { SafariTabProps } from "./types"

export async function performSafariAction(actionScript: string, humanReadableOutput: boolean = true) {
    const script = `
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
    const script = `
        set theURL to URL of front document
        set theHTML to do JavaScript "document.body.innerText" in front document
        return {url: theURL, html: theHTML}
    `

    const result = await performSafariAction(script)
    return convertSafariStringToJson(result)
}

export async function openNewTabAndEnterText(url: string, text: string) {
    const script = `
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

// Save to Capacities

export async function openCapacitiesURLInBackground(url: string) {
    const script = `
        tell application "System Events"
            set frontmostProcess to first process where it is frontmost
            set visible of frontmostProcess to true
        end tell

        tell application "Capacities"
            open location "${url}"
        end tell

        delay 1

        tell application "System Events"
            set frontmost of frontmostProcess to true
        end tell
    `
    return await runAppleScript(script)
}

// Safari Video Extension

export async function getAllVideoTagsInSafari() {
    const script = `
        set videoTags to do JavaScript "Array.from(document.getElementsByTagName('video')).map(v => v.outerHTML)" in front document
        return videoTags
    `

    try {
        const result = await performSafariAction(script)
        if (!result) throw new Error("No videos found on this page")

        return parseArrayFromString(result)
    } catch (error) {
        throw error
    }
}

export async function setVideoPresentationMode(index: number, presentationMode: string) {
    const script = `
        tell application "Safari"
            do JavaScript "document.getElementsByTagName('video')[${index}].webkitSetPresentationMode('${presentationMode}')" in front document
        end tell
    `
    return await runAppleScript(script)
}
