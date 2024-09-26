import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const c = mutation({
	args: {
		serverId: v.id('server'),
		userId: v.string(),
		name: v.string(),
		type: v.optional(v.string()),
		permissions: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		try {
			if (!args.name || args.name.trim() === '') return errors.empty
			if (args.name.trim().length > 32) return errors.tooLong

			const server = await ctx.db
				.query('server')
				.filter(q => q.eq(q.field('_id'), args.serverId))
				.first()
			if (!server) return errors.serverNotFound

			const member = await ctx.db
				.query('member')
				.filter(q => q.and(q.eq(q.field('userId'), args.userId), q.eq(q.field('serverId'), args.serverId)))
				.first()
			if (!member) return errors.memberNotFound

			const channel = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('serverId'), args.serverId))
				.collect()
			if (channel.length >= 32) return errors.tooMany

			await ctx.db.insert('channel', {
				serverId: args.serverId,
				name: args.name.trim(),
				type: 'text'
			})

			return {
				status: 'success',
				code: 200,
				message: 'Channel created'
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const l = query({
	args: {
		serverId: v.id('server'),
		userId: v.string()
	},
	handler: async (ctx, args) => {
		try {
			const server = await ctx.db
				.query('server')
				.filter(q => q.eq(q.field('_id'), args.serverId))
				.first()
			if (!server) return errors.serverNotFound

			const member = await ctx.db
				.query('member')
				.filter(q => q.and(q.eq(q.field('userId'), args.userId), q.eq(q.field('serverId'), args.serverId)))
				.first()
			if (!member) return errors.memberNotFound

			const channel = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('serverId'), args.serverId))
				.collect()

			return {
				status: 'success',
				code: 200,
				message: 'Channels collected',
				data: channel
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const u = mutation({
	args: {
		channelId: v.id('channel'),
		serverId: v.id('server'),
		userId: v.string(),
		name: v.optional(v.string()),
		type: v.optional(v.string()),
		permissions: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		try {
			if (!args.name || args.name.trim() === '') return errors.empty
			if (args.name.trim().length > 32) return errors.tooLong

			const server = await ctx.db
				.query('server')
				.filter(q => q.eq(q.field('_id'), args.serverId))
				.first()
			if (!server) return errors.serverNotFound

			const channel = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('_id'), args.channelId))
				.first()
			if (!channel) return errors.channelNotFound

			if (args.userId !== server.userId) return errors.notAuthorized
			if (args.serverId !== channel.serverId) return errors.notAuthorized

			// Modifier pour gérer voir chaque modifications
			if (args.name.trim() === channel.name.trim()) return errors.unchanged

			await ctx.db.patch(args.channelId, {
				name: args.name,
				type: args.type
			})

			return {
				status: 'success',
				code: 200,
				message: 'Channel updated'
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const d = mutation({
	args: {
		channelId: v.id('channel'),
		serverId: v.id('server'),
		userId: v.string()
	},
	handler: async (ctx, args) => {
		try {
			const server = await ctx.db
				.query('server')
				.filter(q => q.eq(q.field('_id'), args.serverId))
				.first()
			if (!server) return errors.serverNotFound

			const channel = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('_id'), args.channelId))
				.first()
			if (!channel) return errors.channelNotFound

			if (args.userId !== (server.userId || server.ownerId)) return errors.notAuthorized

			const messages = await ctx.db
				.query('message')
				.filter(q => q.eq(q.field('channelId'), args.channelId))
				.collect()
			for (const message of messages) await ctx.db.delete(message._id)
			await ctx.db.delete(args.channelId)

			return {
				status: 'success',
				code: 200,
				message: "Channel deleted and all it's messages too"
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

function handleError(error: unknown) {
	throw error instanceof Error
		? {
				status: 'error',
				code: 500,
				message: error.message || 'Server Error'
			}
		: {
				status: 'error',
				code: 500,
				message: 'Unknown Error',
				details: String(error)
			}
}

const errors = {
	empty: {
		status: 'error',
		code: 400,
		message: 'Message creation refused',
		details: "The channel's name can't be empty"
	},
	notAuthorized: {
		status: 'error',
		code: 403,
		message: 'Action refused',
		details: "You don't have permission to modify this channel"
	},
	tooLong: {
		status: 'error',
		code: 400,
		message: 'Message too long'
	},
	tooMany: {
		status: 'error',
		code: 400,
		message: 'Too many channels'
	},
	unchanged: {
		status: 'error',
		code: 400,
		message: 'Message unchanged'
	},
	serverNotFound: {
		status: 'error',
		code: 404,
		message: 'Server not found',
		details: 'The specified Server does not exist'
	},
	memberNotFound: {
		status: 'error',
		code: 404,
		message: 'Member not found',
		details: 'The specified member does not exist'
	},
	channelNotFound: {
		status: 'error',
		code: 404,
		message: 'Channel not found',
		details: 'The specified channel does not exist'
	}
}
