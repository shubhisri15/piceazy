'use client'
import { Button } from '@/components/ui/button';
import { useCanvas } from '@/context/context';
import { ArrowLeft, Crop, Expand, Eye, Maximize2, Palette, RotateCcw, RotateCw, Sliders, Text } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const TOOLS = [
  {
    id: "resize",
    label: "Resize",
    icon: Expand,
    isActive: true,
  },
  {
    id: "crop",
    label: "Crop",
    icon: Crop,
  },
  {
    id: "adjust",
    label: "Adjust",
    icon: Sliders,
  },
  {
    id: "text",
    label: "Text",
    icon: Text,
  },
  {
    id: "background",
    label: "AI Background",
    icon: Palette,
    proOnly: true,
  },
  {
    id: "ai_extender",
    label: "AI Image Extender",
    icon: Maximize2,
    proOnly: true,
  },
  {
    id: "ai_edit",
    label: "AI Editing",
    icon: Eye,
    proOnly: true,
  },
];

const EXPORT_FORMATS = [
  {
    format: "PNG",
    quality: 1.0,
    label: "PNG (High Quality)",
    extension: "png",
  },
  {
    format: "JPEG",
    quality: 0.9,
    label: "JPEG (90% Quality)",
    extension: "jpg",
  },
  {
    format: "JPEG",
    quality: 0.8,
    label: "JPEG (80% Quality)",
    extension: "jpg",
  },
  {
    format: "WEBP",
    quality: 0.9,
    label: "WebP (90% Quality)",
    extension: "webp",
  },
];

const EditorTopNav = ({ project }) => {

  const router = useRouter()

  // the below states are for when we implement subscription based restrictions on the app

//   const [showUpgradeModal, setShowUpgradeModal] = useState(false);
//   const [restrictedTool, setRestrictedTool] = useState(null);

  const { activeTool, onToolChange, canvasEditor } = useCanvas()

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  const handleToolChange = (toolId) => [
    onToolChange(toolId)
  ]

  return (
    <>
        <div className='border-b px-6 py-3'>
            <div className='flex items-center justify-between mb-4'>
                <Button onClick={handleBackToDashboard} >
                    <ArrowLeft />
                    All Projects
                </Button>
                <h1 className='font-extrabold capitalize'>{project.title}</h1>
                <div>Right actions</div>
            </div>
            <div className='flex items-center justify-between mb-4'>
                <div className='flex justify-between gap-2'>
                    {TOOLS.map((tool) => {
                        const Icon = tool.icon
                        const isActive = activeTool === tool.id
                        return (
                            <Button key={tool.id} onClick={() => handleToolChange(tool.id)}>
                                <Icon />
                                {tool.label}
                            </Button>
                        )
                    })}
                </div>
                {/* Right side controls */}
                <div className="flex items-center gap-4">
                    {/* Undo/Redo */}
                    <div className="flex items-center gap-1">
                    <Button
                        title={`Undo actions available`}
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                        title={`Redo actions available`}
                    >
                        <RotateCw className="h-4 w-4" />
                    </Button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default EditorTopNav