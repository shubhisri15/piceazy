'use client'

import { useCanvas } from "@/context/context"
import { api } from "@/convex/_generated/api"
import { useConvexMutation } from "@/hooks/use-convex-query"
import { useRef, useState } from "react"

export default function Canvas ({ project }) {
    const [isLoading, setIsLoading] = useState(false)

    const canvasRef = useRef()
    const containerRef = useRef()

    const { canvasEditor, setCanvasEditor, activeTool, onToolChange: setActiveTool, processingMessage, setProcessingMessage } = useCanvas()
    const { mutate: updateProject } = useConvexMutation(api.projects.updateProject)

    return (
        <div ref={containerRef} className="relative flex items-center justify-center bg-secondary w-full h-full overflow-hidden">
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                backgroundImage: `
                    linear-gradient(45deg, #64748b 25%, transparent 25%),
                    linear-gradient(-45deg, #64748b 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #64748b 75%),
                    linear-gradient(-45deg, transparent 75%, #64748b 75%)`,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
            />
            <div>
                <canvas ref={canvasRef}/>
            </div>
        </div>
    )

}