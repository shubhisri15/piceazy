'use client'

import { CanvasContext } from "@/context/context"
import { api } from "@/convex/_generated/api"
import { useConvexQuery } from "@/hooks/use-convex-query"
import { EditIcon, Monitor } from "lucide-react"
import { useState } from "react"
import CanvasEditor from "./_components/Canvas"
import EditorSideNav from "./_components/EditorSideNav"
import EditorTopNav from "./_components/EditorTopNav"

const { useParams } = require("next/navigation")

const Editor = () => {
    const { projectId } = useParams()

    const [canvasEditor, setCanvasEditor] = useState(null)
    const [processingMessage, setProcessingMessage] = useState(null)
    const [activeTool, setActiveTool] = useState('resize')

    const { data: project, isLoading, error } = useConvexQuery(api.projects.getProject, { projectId })

    if (isLoading) {
        return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            <p className="text-white/70">Loading...</p>
            </div>
        </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-2">
                    Project Not Found
                </h1>
                <p className="text-white/70">
                    The project you're looking for doesn't exist or you don't have
                    access to it.
                </p>
                </div>
            </div>
        );
    }

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
            <div className='hidden lg:block min-h-screen'>
                <div className='flex flex-col h-screen'>
                    {processingMessage && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center">
                        <div className="rounded-lg p-6 flex flex-col items-center gap-4">
                            <RingLoader color="#fff" />
                            <div className="text-center">
                            <p className="text-white font-medium">{processingMessage}</p>
                            <p className="text-white/70 text-sm mt-1">
                                Please wait, do not switch tabs or navigate away
                            </p>
                            </div>
                        </div>
                        </div>
                    )}
                    {/* Top Bar */}
                    <EditorTopNav project={project} />
                    <div className='flex flex-1 overflow-hidden'>
                        {/* Side Nav */}
                        <EditorSideNav project={project}/>
                        <div className='flex-1'>
                            {/* Canvas */}
                            <CanvasEditor project={project}/>
                        </div>
                    </div>

                    
                </div>
            </div>
        </CanvasContext.Provider>
    )
}

export default Editor