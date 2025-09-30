'use client'

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useConvexQuery } from "@/hooks/use-convex-query"
import { Plus, Star } from "lucide-react"
import { BarLoader } from "react-spinners"
import NewProjectModal from "./_components/NewProjectModal"
import { useState } from "react"
import ProjectGrid from "./_components/ProjectGrid"

const Dashboard = () => {
    const {data: projects, loading} = useConvexQuery(api.projects.getUserProjects)
    const [showAddProjectModal, setShowAddProjectModal] = useState(false)

    return (
        <div className='pt-48 gap-8 min-h-screen px-12'>
            <div className='flex items-center justify-between gap-8'>
                <div>
                    <h1 className='font-bold text-xl'>Your Projects</h1>
                    <p>Create, manage and manipulate your AI-powered image edits</p>
                </div>
                <Button onClick={() => setShowAddProjectModal(true)}><Plus/>New Project</Button>
            </div>     
            {loading ? <BarLoader width={'100%'} color='white'/> : projects && projects.length > 0 ? 
            (<>
                <ProjectGrid projects={projects} />
            </>) : 
                    (
                        <div className='flex flex-col gap-4 items-center border-1 border-white mt-12 py-4'>
                            <p>Upload an image to start creating magic.</p>
                            <Button onClick={() => setShowAddProjectModal(true)}><Star/>Start Creating</Button>
                        </div>
                    )
                }
                <NewProjectModal isOpen={showAddProjectModal} onClose={() => setShowAddProjectModal(false)}/>
        </div>
    );
}

export default Dashboard