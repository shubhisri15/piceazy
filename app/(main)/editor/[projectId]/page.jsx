'use client'

import { CanvasContext } from "@/context/context"
import { Monitor } from "lucide-react"
import { useState } from "react"

const { useParams } = require("next/navigation")

const Editor = () => {
    const { projectId } = useParams()

    const [canvasEditor, setCanvasEditor] = useState(null)
    const [processingMessage, setProcessingMessage] = useState(null)
    const [activeTool, setActiveTool] = useState('resize')

    return (
        <CanvasContext.Provider value={{ canvasEditor, setCanvasEditor, activeTool, onToolChange: setActiveTool, processingMessage, setProcessingMessage }}>
            <div className='lg:hidden min-h-screen'>
                <div>
                    <Monitor/>
                    <h1>Desktop required</h1>
                    <p>This editor is only usable on desktop</p>
                    <p>Please use a larger screen to access the full editing experience.</p>
                </div>
            </div>
            <div className='hidden lg:block'>
                Editor: {projectId}
            </div>
        </CanvasContext.Provider>
    )
}

export default Editor