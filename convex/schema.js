import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
    users: defineTable({
        name: v.string(),
        tokenIdentifier: v.string(),
        imageUrl: v.optional(v.string()),
        email: v.string(),
        plan: v.union(v.literal('free')),
        projects: v.number(),
        exportsThisMonth: v.number(),
        createdAt: v.number(),
        updatedAt: v.number()
    }).index("by_token", ["tokenIdentifier"]) // Primary auth lookup
        .index("by_email", ["email"]) // Email lookups
        .searchIndex("search_name", { searchField: "name" }) // User search
        .searchIndex("search_email", { searchField: "email" }),

    projects: defineTable({
        title: v.string(),
        userId: v.id('users'),
        canvasState: v.any(),
        width: v.number(),
        height: v.number(),
        originalImageUrl: v.optional(v.string()),
        currentImageUrl: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
        activeTransformations: v.optional(v.string()),
        backgroundRemoved: v.optional(v.boolean()),
        folderId: v.optional(v.id('folders')),
        createdAt: v.number(),
        updatedAt: v.number()
    }).index('by_user', ['userId']).index("by_user_updated", ["userId", "updatedAt"]).index('by_folder', ['folderId']),

    folders: defineTable({
        name: v.string(),
        userId: v.id('users'),
        createdAt: v.number(),
    }).index('by_user', ['userId'])
})
