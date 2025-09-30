import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { useConvexMutation } from "@/hooks/use-convex-query"
import { Edit, Trash } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"

export default function ProjectCard({ project, onEdit }) {
    const { mutate: deleteProject, isLoading } = useConvexMutation(api.projects.deleteProject)
    const lastUpdatedAt = formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })

    const handleDelete = async () => {
        const confirmed = confirm(`Are you sure you want to delete ${project.title}? You will lose all progress.`)
        if (confirmed) {
            try {
                await deleteProject({ projectId: project._id})
                toast.success('Project deleted successfully')
            } catch (e) {
                console.error('Error deleting project: ', e)
                toast.error('Something went wrong while deleting the project, please try again.')
            }    
        }
    }

    return (
        <Card className='group relative overflow-hidden'>
            <div className='aspect-video bg-slate-700 relative overflow-hidden'>
                {
                    project.thumbnailUrl && (
                        <img src={project.thumbnailUrl} alt={project.title} className='w-full h-full object-cover'/>
                    )
                }
                <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex gap-4 px-4'>
                    <Button onClick={onEdit}>
                        <Edit />
                        Edit
                    </Button>
                    <Button onClick={handleDelete} disabled={isLoading}>
                        <Trash />
                        Delete
                    </Button>
                </div>
            </div>
            <CardContent>
                <h3>{project.title}</h3>
                <div className='text-sm text-slate-400 flex justify-between mt-4'>
                    <span>Updated {lastUpdatedAt}</span>
                    <Badge variant='secondary' className='text-xs bg-slate-700 text-white/70'>
                        {project.width} x {project.height}
                    </Badge>
                </div>
                
            </CardContent>
            
        </Card>
    )
}