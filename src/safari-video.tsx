import { useState, useEffect } from "react";
import { showToast, Toast, List, ActionPanel, Action, closeMainWindow, PopToRootType } from "@raycast/api";
import { getAllVideoTagsInSafari, setVideoPresentationMode } from "./applescript";

export default function Command() {
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
        setVideoPresentationMode(index)
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
                            <Action title="Set vide picture-in-picture" onAction={() => onAction(i)} />
                        </ActionPanel>
                    }

                />
            )}
        </List>
    )
}