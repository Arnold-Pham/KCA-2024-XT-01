import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema(
	{
		user: defineTable({
			userId: v.string(),
			userName: v.string(),
			picture: v.string()
		}),
		server: defineTable({
			userId: v.id('user'),
			name: v.string(),
			ownerId: v.optional(v.string()),
			owner: v.optional(v.string()),
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
		role: defineTable({
			serverId: v.id('server'),
			name: v.string(),
			permissions: v.object({
				createChannel: v.boolean(),
				deleteChannel: v.boolean(),
				updateChannel: v.boolean(),
				manageRoles: v.boolean(),
				sendMessage: v.boolean(),
				deleteMessage: v.boolean()
			}),
			createdBy: v.string()
		}),
		member: defineTable({
			serverId: v.id('server'),
			userId: v.id('user'),
			role: v.optional(v.id('role'))
		}),
		channel: defineTable({
			serverId: v.id('server'),
			name: v.string(),
			type: v.optional(v.string()),
			permissions: v.optional(v.string())
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
