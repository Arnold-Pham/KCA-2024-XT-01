import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema(
	{
		user: defineTable({
			username: v.string(),
			picture: v.string(),
			authId: v.string()
		}),
		server: defineTable({
			userId: v.id('user'),
			name: v.string(),
			ownerId: v.optional(v.string()),
			description: v.optional(v.string())
		}),
		invitCode: defineTable({
			serverId: v.id('server'),
			creatorId: v.string(),
			code: v.string(),
			uses: v.number(),
			maxUses: v.optional(v.number()),
			expiresAt: v.optional(v.number())
		}),
		member: defineTable({
			serverId: v.id('server'),
			userId: v.id('user')
		}),
		channel: defineTable({
			serverId: v.id('server'),
			name: v.string(),
			type: v.optional(v.union(v.literal('text'), v.literal('vocal')))
		}),
		message: defineTable({
			channelId: v.id('channel'),
			userId: v.id('user'),
			content: v.string(),
			modified: v.boolean(),
			modifiedAt: v.union(v.number(), v.null()),
			deleted: v.boolean()
		})
	},
	{ schemaValidation: true }
)
