import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { useConvexMutation } from "@/hooks/use-convex-query"
import { Label } from "@radix-ui/react-dropdown-menu"
import { ImageIcon, Loader, Upload, X } from "lucide-react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

const NewProjectModal = ({ isOpen, onClose }) => {
    const [uploading, setUploading] = useState(false)
    const [projectTitle, setProjectTitle] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    const { mutate: createProject } = useConvexMutation(api.projects.create)

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));

            // Auto-generate title from filename
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
            setProjectTitle(nameWithoutExt || "Untitled Project");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
        },
        maxFiles: 1,
        maxSize: 20 * 1024 * 1024
    })

    const handleClose = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
        setProjectTitle('')
        setUploading(false)
        onClose()
    }

    const handleCreateProject = () => {
        onClose()
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                        {!selectedFile ? (
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                            isDragActive
                                ? "border-cyan-400 bg-cyan-400/5"
                                : "border-white/20 hover:border-white/40"
                            }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="h-12 w-12 text-white/50 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                            {isDragActive ? "Drop your image here" : "Upload an Image"}
                            </h3>
                            <p className="text-white/70 mb-4">Drag and drop your image, or click to browse</p>
                            <p className="text-sm text-white/50">
                            Supports PNG, JPG, WEBP up to 20MB
                            </p>
                        </div>
                        ) : (
                        <div className="space-y-6">
                            {/* Image Preview */}
                            <div className="relative">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-64 object-cover rounded-xl border border-white/10"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                setSelectedFile(null);
                                setPreviewUrl(null);
                                setProjectTitle("");
                                }}
                                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            </div>

                            {/* Project Title Input */}
                            <div className="space-y-2">
                            <Label htmlFor="project-title" className="text-white">
                                Project Title
                            </Label>
                            <Input
                                id="project-title"
                                type="text"
                                value={projectTitle}
                                onChange={(e) => setProjectTitle(e.target.value)}
                                placeholder="Enter project name..."
                                className="bg-slate-700 border-white/20 text-white placeholder-white/50 focus:border-cyan-400 focus:ring-cyan-400"
                            />
                            </div>

                            {/* File Details */}
                            <div className="bg-slate-700/50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <ImageIcon className="h-5 w-5 text-cyan-400" />
                                <div>
                                <p className="text-white font-medium">
                                    {selectedFile.name}
                                </p>
                                <p className="text-white/70 text-sm">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>
                        )}
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleCreateProject} disabled={uploading}>
                            {
                                uploading ? (
                                    <><Loader className='animate-spin'/> Creating..</>
                                ) : ('Create Project')
                            }
                        </Button>
                        <Button onClick={handleClose} disabled={uploading}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewProjectModal

