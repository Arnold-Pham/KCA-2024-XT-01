import { error, handleError, verifyUSMC } from './errors'
import { mutation, query } from './_generated/server'
import { Doc } from './_generated/dataModel'
import { v } from 'convex/values'

export const c = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		channelId: v.id('channel'),
		content: v.string()
	},

	handler: async (ctx, { userId, serverId, channelId, content }) => {
		try {
			if (!content || content.trim() === '') return error.messageEmpty
			if (content.trim().length > 1000) return error.messageTooLong

			const validationError = await verifyUSMC(ctx, { userId, serverId, channelId })
			if (validationError) return validationError

			await ctx.db.insert('message', {
				channelId,
				userId,
				content: content.trim(),
				modified: false,
				modifiedAt: null,
				deleted: false
			})

			return {
				status: 'success',
				code: 200,
				message: 'MESSAGE_SENT',
				details: 'The message has been successfully sent'
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const l = query({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		channelId: v.id('channel')
	},

	handler: async (ctx, args) => {
		try {
			const validationError = await verifyUSMC(ctx, args)
			if (validationError) return validationError

			const messagesWithName: (Doc<'message'> & { username?: string; picture?: string | null })[] = []

			const messages = await ctx.db
				.query('message')
				.filter(q => q.eq(q.field('channelId'), args.channelId))
				.order('desc')
				.take(50)

			await Promise.all(
				messages.map(async message => {
					const user = await ctx.db.get(message.userId)
					messagesWithName.push({
						...message,
						username: user?.username,
						picture: user?.picture
					})
				})
			)
			return {
				status: 'success',
				code: 200,
				message: 'MESSAGES_GATHERED',
				details: 'The last fifty messages have been successfully retrieved along with user information',
				data: messagesWithName.reverse()
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const u = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		channelId: v.id('channel'),
		messageId: v.id('message'),
		content: v.string()
	},

	handler: async (ctx, { userId, serverId, channelId, messageId, content }) => {
		try {
			if (!content || content.trim() === '') return error.messageEmpty
			if (content.trim().length > 1000) return error.messageTooLong

			const validationError = await verifyUSMC(ctx, { userId, serverId, channelId })
			if (validationError) return validationError

			const message = await ctx.db.get(messageId)
			if (!message) return error.unknownMessage
			if (message.deleted) return error.messageDeleted
			if (userId !== message.userId) return error.userNotAuthorized
			if (content.trim() === message.content) return error.messageUnchanged

			await ctx.db.patch(messageId, {
				content: content.trim(),
				modified: true,
				modifiedAt: Date.now()
			})

			return {
				status: 'success',
				code: 200,
				message: 'MESSAGE_UPDATED',
				details: 'The message has been successfully updated'
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const d = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		channelId: v.id('channel'),
		messageId: v.id('message')
	},

	handler: async (ctx, args) => {
		try {
			const validationError = await verifyUSMC(ctx, args)
			if (validationError) return validationError

			const message = await ctx.db.get(args.messageId)
			if (!message) return error.unknownMessage
			if (message.deleted) return error.messageDeleted
			if (args.userId !== message.userId) return error.userNotAuthorized

			await ctx.db.patch(args.messageId, {
				modifiedAt: Date.now(),
				deleted: true
			})

			return {
				status: 'success',
				code: 200,
				message: 'MESSAGE_DELETED',
				details: 'The message has been successfully deleted'
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})
