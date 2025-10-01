import { useCanvas } from '@/context/context';
import { Crop, Expand, Eye, Maximize2, Palette, Sliders, Text } from 'lucide-react';
import React from 'react'
import CropContent from './_tools/CropContent';
import AdjustControls from './_tools/AdjustControls';
import BackgroundControls from './_tools/BackgroundControls';
import AIExtenderControls from './_tools/AIExtenderControls';
import ResizeControls from './_tools/ResizeControls';

const TOOL_CONFIGS = {
  resize: {
    title: "Resize",
    icon: Expand,
    description: "Change project dimensions",
  },
  crop: {
    title: "Crop",
    icon: Crop,
    description: "Crop and trim your image",
  },
  adjust: {
    title: "Adjust",
    icon: Sliders,
    description: "Brightness, contrast, and more (Manual saving required)",
  },
  background: {
    title: "Background",
    icon: Palette,
    description: "Remove or change background",
  },
  ai_extender: {
    title: "AI Image Extender",
    icon: Maximize2,
    description: "Extend image boundaries with AI",
  },
  text: {
    title: "Add Text",
    icon: Text,
    description: "Customize in Various Fonts",
  },
  ai_edit: {
    title: "AI Editing",
    icon: Eye,
    description: "Enhance image quality with AI",
  },
};


const EditorSideNav = ({ project }) => {
    const { activeTool } = useCanvas()
    const toolConfig = TOOL_CONFIGS[activeTool]

    if (!toolConfig) return null

    const Icon = toolConfig.icon
    return (
        <div className='min-w-96 border-r flex flex-col'>
            <div className='p-4 border-b'>
                <div className='flex items-center gap-3'>
                    <Icon />
                    <h2>{toolConfig.title}</h2>
                </div>
                <p>{toolConfig.description}</p>
            </div>
            <div className='flex-1 p-4'>
                {renderToolConfig(activeTool, project)}
            </div>
        </div>
    )
}

function renderToolConfig(activeTool, project) {
    switch (activeTool) {
        case "crop":
            return <CropContent />;
        case "resize":
            return <ResizeControls project={project} />;
        case "adjust":
            return <AdjustControls />;
        case "background":
            return <BackgroundControls project={project} />;
        case "ai_extender":
            return <AIExtenderControls project={project} />;
        case "text":
            return <TextControls />;
        case "ai_edit":
            return <AIEdit project={project} />;
        default:
            return <div className="text-white">Select a tool to get started</div>;
    }
}

export default EditorSideNav