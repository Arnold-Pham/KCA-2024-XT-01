import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const c = mutation({
	args: {
		channelId: v.id('channel'),
		serverId: v.id('server'),
		userId: v.string(),
		content: v.string()
	},
	handler: async (ctx, args) => {
		try {
			if (!args.content || args.content.trim() === '') return errors.empty
			if (args.content.trim().length > 3000) return errors.tooLong

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
				.filter(q => q.eq(q.field('_id'), args.channelId))
				.first()
			if (!channel) return errors.channelNotFound

			await ctx.db.insert('message', {
				channelId: args.channelId,
				userId: args.userId,
				content: args.content.trim(),
				modified: false,
				modifiedAt: null,
				deleted: false
			})

			return { status: 'success', code: 200, message: 'Message sent' }
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const l = query({
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

			const member = await ctx.db
				.query('member')
				.filter(q => q.and(q.eq(q.field('userId'), args.userId), q.eq(q.field('serverId'), args.serverId)))
				.first()
			if (!member) return errors.memberNotFound

			const channel = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('_id'), args.channelId))
				.first()
			if (!channel) return errors.channelNotFound

			// Ajouter de la pagination
			const messages = await ctx.db
				.query('message')
				.filter(q => q.eq(q.field('channelId'), args.channelId))
				.order('desc')
				.take(50)

			return { status: 'success', code: 200, message: 'Messages collected', data: messages.reverse() }
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const u = mutation({
	args: {
		messageId: v.id('message'),
		channelId: v.id('channel'),
		serverId: v.id('server'),
		userId: v.string(),
		content: v.string()
	},
	handler: async (ctx, args) => {
		try {
			if (!args.content || args.content.trim() === '') return errors.empty
			if (args.content.trim().length > 3000) return errors.tooLong

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
				.filter(q => q.eq(q.field('_id'), args.channelId))
				.first()
			if (!channel) return errors.channelNotFound

			const message = await ctx.db
				.query('message')
				.filter(q => q.eq(q.field('_id'), args.messageId))
				.first()
			if (!message) return errors.messageNotFound

			if (message.deleted) return errors.deleted
			if (args.userId !== message.userId) return errors.notAuthorized
			if (args.content.trim() === message.content.trim()) return errors.unchanged

			await ctx.db.patch(args.messageId, {
				content: args.content,
				modified: true,
				modifiedAt: Date.now()
			})

			return { status: 'success', code: 200, message: 'Message updated' }
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const d = mutation({
	args: {
		messageId: v.id('message'),
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

			const member = await ctx.db
				.query('member')
				.filter(q => q.and(q.eq(q.field('userId'), args.userId), q.eq(q.field('serverId'), args.serverId)))
				.first()
			if (!member) return errors.memberNotFound

			const channel = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('_id'), args.channelId))
				.first()
			if (!channel) return errors.channelNotFound

			const message = await ctx.db
				.query('message')
				.filter(q => q.eq(q.field('_id'), args.messageId))
				.first()
			if (!message) return errors.messageNotFound

			if (message.deleted) return errors.deleted

			// À modifier pour autoriser la modération
			if (args.userId !== message.userId) return errors.notAuthorized

			await ctx.db.patch(args.messageId, {
				modifiedAt: Date.now(),
				deleted: true
			})

			return {
				status: 'success',
				code: 200,
				message: 'Message deleted'
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
		message: 'Action refused',
		details: 'The message has already been deleted'
	},
	empty: {
		status: 'error',
		code: 400,
		message: 'Message sending refused',
		details: "The message can't be empty"
	},
	tooLong: {
		status: 'error',
		code: 400,
		message: 'Message too long'
	},
	unchanged: {
		status: 'error',
		code: 400,
		message: 'Message unchanged'
	},
	notAuthorized: {
		status: 'error',
		code: 403,
		message: 'Action refused',
		details: "You don't have enough permissions to do that"
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
	},
	messageNotFound: {
		status: 'error',
		code: 404,
		message: 'Message not found',
		details: 'The specified message does not exist'
	}
}
