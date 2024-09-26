import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const c = mutation({
	args: {
		serverId: v.id('server'),
		name: v.string(),
		order: v.number(),
		type: v.optional(v.string()),
		permissions: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		try {
			if (!args.name || args.name.trim() === '') return errors.empty

			await ctx.db.insert('channel', {
				serverId: args.serverId,
				name: args.name.trim(),
				order: 1,
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

			if (!server) return errors.notFound

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
		order: v.optional(v.number())
	},
	handler: async (ctx, args) => {
		try {
			const server = await ctx.db
				.query('server')
				.filter(q => q.eq(q.field('_id'), args.serverId))
				.first()

			if (!server) return errors.notFound

			const channel = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('_id'), args.channelId))
				.first()

			if (!channel) return errors.notFound2
			if (args.userId !== server.userId) return errors.notAuthorized
			if (args.serverId !== channel.serverId) return errors.notAuthorized

			await ctx.db.patch(args.channelId, {
				name: args.name,
				type: args.type,
				order: args.order
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

			if (!server) return errors.notFound

			const channel = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('_id'), args.channelId))
				.first()

			if (!channel) return errors.notFound2
			if (args.userId !== server.userId) return errors.notAuthorized
			if (args.serverId !== channel.serverId) return errors.notAuthorized

			await ctx.db.delete(args.channelId)

			return {
				status: 'success',
				code: 200,
				message: 'Channel deleted'
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
	deleted: {
		status: 'error',
		code: 400,
		message: 'Message deletion refused',
		details: 'The message has already been deleted'
	},
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
	notFound: {
		status: 'error',
		code: 404,
		message: 'Server not found',
		details: 'The specified server does not exist'
	},
	notFound2: {
		status: 'error',
		code: 404,
		message: 'Channel not found',
		details: 'The specified channel does not exist'
	}
}
