'use client'
import { useRouter } from "next/navigation"
import ProjectCard from "./ProjectCard"

export default function ProjectGrid ({ projects }) {
    const router = useRouter()
    const handleEditProject = (projectId) => {
        router.push(`/editor/${projectId}`)
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8'>
            {
                projects.map((project) => {
                    return <ProjectCard key={project._id} project={project} onEdit={() => handleEditProject(project._id)}/>
                })
            }
        </div>
    )
}