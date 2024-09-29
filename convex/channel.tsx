import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const c = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		name: v.string()
	},
	handler: async (ctx, { name, userId, serverId }) => {
		try {
			if (!name || name.trim() === '') return
			if (name.trim().length > 32) return
			const user = await ctx.db.get(userId)
			if (!user) return
			const server = await ctx.db.get(serverId)
			if (!server) return

			const member = await ctx.db
				.query('member')
				.filter(q => q.and(q.eq(q.field('userId'), userId), q.eq(q.field('serverId'), serverId)))
				.first()
			if (!member) return

			const channels = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('serverId'), serverId))
				.collect()
			if (channels.length >= 32) return

			await ctx.db.insert('channel', {
				serverId,
				name: name.trim(),
				type: 'text'
			})

			return {
				status: 'success',
				code: 200,
				message: 'CHANNEL_CREATED',
				details: 'Le channel a bien été créé'
			}
		} catch (error) {
			return handleError(error)
		}
	}
})

export const l = query({
	args: {
		serverId: v.id('server'),
		userId: v.id('user')
	},
	handler: async (ctx, { userId, serverId }) => {
		try {
			const user = await ctx.db.get(userId)
			if (!user) return
			const server = await ctx.db.get(serverId)
			if (!server) return

			const member = await ctx.db
				.query('member')
				.filter(q => q.and(q.eq(q.field('userId'), userId), q.eq(q.field('serverId'), serverId)))
				.first()
			if (!member) return

			const channels = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('serverId'), serverId))
				.collect()

			return {
				status: 'success',
				code: 200,
				message: 'CHANNELS_GATHERED',
				details: 'La liste des channels à été récupérée',
				data: channels
			}
		} catch (error) {
			return handleError(error)
		}
	}
})

export const u = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		channelId: v.id('channel'),
		name: v.optional(v.string()),
		type: v.optional(v.union(v.literal('text'), v.literal('vocal')))
	},
	handler: async (ctx, { userId, serverId, channelId, name, type }) => {
		try {
			if (!name && !type) return
			if (name && name.trim().length === 0) return
			if (name && name.trim().length > 32) return
			if (type && type !== 'text' && type !== 'vocal') return

			const user = await ctx.db.get(userId)
			if (!user) return
			const server = await ctx.db.get(serverId)
			if (!server) return
			const channel = await ctx.db.get(channelId)
			if (!channel) return

			if (userId !== server.userId && userId !== server.ownerId) return

			await ctx.db.patch(channelId, {
				name: name ? name.trim() : channel.name,
				type: type || channel.type
			})

			return {
				status: 'success',
				code: 200,
				message: 'CHANNEL_UPDATED',
				details: 'Le channel à été mis a jour'
			}
		} catch (error) {
			return handleError(error)
		}
	}
})

export const d = mutation({
	args: {
		channelId: v.id('channel'),
		serverId: v.id('server'),
		userId: v.id('user')
	},
	handler: async (ctx, { userId, serverId, channelId }) => {
		try {
			const user = await ctx.db.get(userId)
			if (!user) return
			const server = await ctx.db.get(serverId)
			if (!server) return
			const channel = await ctx.db.get(channelId)
			if (!channel) return
			if (userId !== server.userId && userId !== server.ownerId) return

			const messages = await ctx.db
				.query('message')
				.filter(q => q.eq(q.field('channelId'), channelId))
				.collect()

			for (const message of messages) await ctx.db.delete(message._id)
			await ctx.db.delete(channelId)

			return {
				status: 'success',
				code: 200,
				message: 'CHANNEL_DELETED',
				details: 'Le channel et tous ces messages ont été supprimés'
			}
		} catch (error) {
			return handleError(error)
		}
	}
})

function handleError(error: unknown) {
	return error instanceof Error
		? {
				status: 'error',
				code: 500,
				message: 'SERVER_ERROR',
				details: error.message || 'Server Error'
			}
		: {
				status: 'error',
				code: 500,
				message: 'UNKNOWN_ERROR',
				details: String(error)
			}
}
