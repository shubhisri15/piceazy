'use client'

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useConvexQuery } from "@/hooks/use-convex-query"
import { Plus } from "lucide-react"

const Dashboard = () => {
    const {data: projects, loading} = useConvexQuery(api.projects.getUserProjects)
    console.log(projects)

    return loading ? (
        <div>Loading</div>
        ) : (
        <div className='flex flex-col items-center justify-between mb-8 mt-48 gap-8'>
            <div>
                <h1 className='font-bold text-xl'>Your Projects</h1>
                <p>Create, manage and manipulate your AI-powered image edits</p>
            </div>
            <div>
                <Button><Plus/>New Project</Button>
            </div>
        </div>
        );
}

export default Dashboard