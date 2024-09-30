import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema(
	{
		user: defineTable({
			username: v.string(),
			picture: v.optional(v.union(v.string(), v.null())),
			authId: v.string()
		}),
		server: defineTable({
			userId: v.id('user'),
			name: v.string(),
			ownerId: v.optional(v.union(v.string(), v.null())),
			description: v.optional(v.union(v.string(), v.null()))
		}),
		invitCode: defineTable({
			serverId: v.id('server'),
			creatorId: v.string(),
			code: v.string(),
			uses: v.number(),
			maxUses: v.optional(v.union(v.number(), v.null())),
			expiresAt: v.optional(v.union(v.number(), v.null()))
		}),
		member: defineTable({
			userId: v.id('user'),
			serverId: v.id('server')
		}),
		channel: defineTable({
			serverId: v.id('server'),
			name: v.string(),
			type: v.optional(v.union(v.literal('text'), v.literal('vocal')))
		}),
		message: defineTable({
			userId: v.id('user'),
			channelId: v.id('channel'),
			content: v.string(),
			modified: v.boolean(),
			modifiedAt: v.optional(v.union(v.number(), v.null())),
			deleted: v.boolean()
		})
	},
	{ schemaValidation: true }
)
