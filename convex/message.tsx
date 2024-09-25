import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const c = mutation({
	args: {
		channelId: v.id('channel'),
		userId: v.string(),
		content: v.string()
	},
	handler: async (ctx, args) => {
		try {
			if (!args.content || args.content.trim() === '') return errors.empty

			await ctx.db.insert('message', {
				channelId: args.channelId,
				userId: args.userId,
				content: args.content.trim(),
				modified: false,
				modifiedAt: null,
				deleted: false
			})

			return {
				status: 'success',
				code: 200,
				message: 'Message sent'
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const l = query({
	args: {
		channelId: v.id('channel')
	},
	handler: async (ctx, args) => {
		try {
			const channel = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('_id'), args.channelId))
				.first()

			if (!channel) return errors.notFound

			const msgs = await ctx.db
				.query('message')
				.filter(q => q.eq(q.field('channelId'), args.channelId))
				.order('desc')
				.take(50)

			return {
				status: 'success',
				code: 200,
				message: 'Messages collected',
				data: msgs.reverse()
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const u = mutation({
	args: {
		messageId: v.id('message'),
		channelId: v.id('channel'),
		userId: v.string(),
		content: v.string()
	},
	handler: async (ctx, args) => {
		try {
			const channel = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('_id'), args.channelId))
				.first()

			if (!channel) return errors.notFound

			const msg = await ctx.db
				.query('message')
				.filter(q => q.eq(q.field('_id'), args.messageId))
				.first()

			if (!msg) return errors.notFound2
			if (args.userId !== msg.userId) return errors.notAuthor
			if (args.channelId !== msg.channelId) return errors.notAuthorized

			await ctx.db.patch(args.messageId, {
				content: args.content,
				modified: true,
				modifiedAt: Date.now()
			})

			return {
				status: 'success',
				code: 200,
				message: 'Message updated'
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const d = mutation({
	args: {
		messageId: v.id('message'),
		channelId: v.id('channel'),
		userId: v.string()
	},
	handler: async (ctx, args) => {
		try {
			const channel = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('_id'), args.channelId))
				.first()

			if (!channel) return errors.notFound

			const msg = await ctx.db
				.query('message')
				.filter(q => q.eq(q.field('_id'), args.messageId))
				.first()

			if (!msg) return errors.notFound
			if (msg.deleted) return errors.deleted
			if (args.userId !== msg.userId) return errors.notAuthor
			if (args.channelId !== msg.channelId) return errors.notAuthorized

			// TBD
			await ctx.db.patch(args.messageId, {
				content: '',
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
		message: 'Message deletion refused',
		details: 'The message has already been deleted'
	},
	empty: {
		status: 'error',
		code: 400,
		message: 'Message sending refused',
		details: 'The content of the message is empty'
	},
	notAuthor: {
		status: 'error',
		code: 403,
		message: 'Action refused',
		details: 'You are not the author of this message'
	},
	notAuthorized: {
		status: 'error',
		code: 403,
		message: 'Action refused',
		details: "You don't have permission to modify this message"
	},
	notFound: {
		status: 'error',
		code: 404,
		message: 'Channel not found',
		details: 'The specified channel does not exist'
	},
	notFound2: {
		status: 'error',
		code: 404,
		message: 'Message not found',
		details: 'The specified message does not exist'
	}
}
