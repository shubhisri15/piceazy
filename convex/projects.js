import { mutation } from "./_generated/server";
import { fetchCurrentUser } from "./users";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const create = mutation({
    args: {
        title: v.string(),
        canvasState: v.optional(v.any()),
        width: v.number(),
        height: v.number(),
        originalImageUrl: v.optional(v.string()),
        currentImageUrl: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await fetchCurrentUser(ctx);

        const projectId = await ctx.db.insert('projects', {
            title: args.title,
            userId: user._id,
            canvasState: args.canvasState,
            width: args.width,
            height: args.height,
            originalImageUrl: args.originalImageUrl,
            currentImageUrl: args.currentImageUrl,
            thumbnailUrl: args.thumbnailUrl,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })

        await ctx.db.patch(user._id, {
            projects: user.projects + 1
        })

        return projectId
    }
})

export const getUserProjects = query({
    handler: async (ctx) => {
        const user = await fetchCurrentUser(ctx);
        const projects = await ctx.db.query('projects').withIndex('by_user_updated', (q) => q.eq('userId', user._id)).order('desc').collect()

        return projects
    }
})

export const deleteProject = mutation({
    args: {
        projectId: v.id('projects')
    },
    handler: async (ctx, args) => {
        const user = await fetchCurrentUser(ctx);
        const projectToDelete = await ctx.db.get(args.projectId)

        if (!projectToDelete) {
            throw new Error('Project does not exist')
        }

        if (!user || user._id !== projectToDelete.userId) {
            throw new Error('Access denied')
        }

        await ctx.db.delete(args.projectId)
        await ctx.db.patch(user._id, {
            projects: Math.max(0, user.projects - 1),
            updatedAt: Date.now()
        })
    }
})

export const getProject = query({
    args: { projectId: v.id('projects')},
    handler: async (ctx, args) => {
        const user = await fetchCurrentUser(ctx);
        const project = await ctx.db.get(args.projectId)

        if (!project) {
            throw new Error('Project does not exist')
        }

        if (!user || user._id !== project.userId) {
            throw new Error('Access denied')
        }

        return project
    }
})

export const updateProject = mutation({
    args: {
        projectId: v.id('projects'),
        canvasState: v.optional(v.any()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        currentImageUrl: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
        activeTransformations: v.optional(v.string()),
        backgroundRemoved: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const user = await fetchCurrentUser(ctx);
        const project = await ctx.db.get(args.projectId)

        if (!project) {
            throw new Error('Project does not exist')
        }

        if (!user || user._id !== project.userId) {
            throw new Error('Access denied')
        }

        const updateData = {
            updatedAt: Date.now()
        }

        if (args.canvasState !== undefined)
            updateData.canvasState = args.canvasState;
        if (args.width !== undefined) updateData.width = args.width;
        if (args.height !== undefined) updateData.height = args.height;
        if (args.currentImageUrl !== undefined)
             updateData.currentImageUrl = args.currentImageUrl;
        if (args.thumbnailUrl !== undefined)
            updateData.thumbnailUrl = args.thumbnailUrl;
        if (args.activeTransformations !== undefined)
            updateData.activeTransformations = args.activeTransformations;
        if (args.backgroundRemoved !== undefined)
            updateData.backgroundRemoved = args.backgroundRemoved;

        await ctx.db.patch(args.projectId, updateData)

        return args.projectId;
    }
})