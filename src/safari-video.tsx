import { useState, useEffect } from "react";
import { showToast, Toast, List, ActionPanel, Action, closeMainWindow, PopToRootType } from "@raycast/api";
import { getAllVideoTagsInSafari, setVideoPresentationMode } from "./applescript";

export enum PresentationMode {
    Pip = 'picture-in-picture',
    Fullscreen = 'fullscreen'
}

interface CommandProps {
    presentationMode: PresentationMode
}

export default function Command({ presentationMode }: CommandProps) {
    const [loading, setLoading] = useState(true)
    const [videos, setVideos] = useState<string[]>([])

    useEffect(() => {
        getVideos()
    }, []);

    const getVideos = async () => {
        try {
            const result = await getAllVideoTagsInSafari()

            if (result.length === 1) {
                onAction(0)
                return
            }

            if (result[0].includes(`src="blob:https://www.youtube.com/`)) {
                onAction(0)
                return
            }

            setVideos(result)
        } catch (error) {
            await showToast({
                style: Toast.Style.Failure,
                title: error.message ?? "An error occurred",
            });
        } finally {
            setLoading(false)
        }
    }

    const onAction = (index: number) => {
        setVideoPresentationMode(index, presentationMode)
        closeMainWindow({ popToRootType: PopToRootType.Immediate })
    }

    return (
        <List isLoading={loading}>
            {videos.map((v, i) =>
                <List.Item
                    title={v}
                    key={i}
                    actions={
                        <ActionPanel>
                            <Action title={presentationMode} onAction={() => onAction(i)} />
                        </ActionPanel>
                    }

                />
            )}
        </List>
    )
}