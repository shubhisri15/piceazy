'use client'

import { CanvasContext } from "@/context/context"

const { useParams } = require("next/navigation")

const Editor = async () => {
    const { projectId } = useParams()

    return (
        <CanvasContext.Provider>
            Editor: {projectId}
        </CanvasContext.Provider>
    )
}

export default Editor