import SafariVideo, { PresentationMode } from "./safari-video";

export default function Command() {
    return <SafariVideo presentationMode={PresentationMode.Fullscreen} />
}