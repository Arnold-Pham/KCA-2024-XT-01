import { mutation, query, MutationCtx, QueryCtx } from './_generated/server'
import { Id } from './_generated/dataModel'
import { v } from 'convex/values'

export const c = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		channelId: v.id('channel'),
		content: v.string()
	},

	handler: async (ctx, args) => {
		try {
			if (!args.content || args.content.trim() === '') return error.messageEmpty
			if (args.content.trim().length > 3000) return error.messageTooLong

			const validationError = await verifyUserServerChannel(ctx, args)
			if (validationError) return validationError

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
				message: 'MESSAGE_SENT',
				details: 'Le message a bien été envoyé'
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
			const validationError = await verifyUserServerChannel(ctx, args)
			if (validationError) return validationError
			const messagesWithName = []

			const messages = await ctx.db
				.query('message')
				.filter(q => q.eq(q.field('channelId'), args.channelId))
				.order('desc')
				.take(50)

			for (const message of messages) {
				const user = await ctx.db
					.query('user')
					.filter(q => q.eq(q.field('_id'), message.userId))
					.first()

				messagesWithName.push({
					...message,
					username: user?.username,
					picture: user?.picture
				})
			}

			return {
				status: 'success',
				code: 200,
				message: 'MESSAGES_GATHERED',
				details: 'Les cinquante derniers messages ont été récupérés',
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

	handler: async (ctx, args) => {
		try {
			if (!args.content || args.content.trim() === '') return error.messageEmpty
			if (args.content.trim().length > 3000) return error.messageTooLong

			const validationError = await verifyUserServerChannel(ctx, args)
			if (validationError) return validationError

			const message = await ctx.db
				.query('message')
				.filter(q => q.eq(q.field('_id'), args.messageId))
				.first()
			if (!message) return error.unknownMessage

			if (message.deleted) return error.messageDeleted
			if (args.userId !== message.userId) return error.messageNotAuthor
			if (args.content.trim() === message.content) return error.messageUnchanged

			await ctx.db.patch(args.messageId, {
				content: args.content,
				modified: true,
				modifiedAt: Date.now()
			})

			return {
				status: 'success',
				code: 200,
				message: 'MESSAGE_UPDATED',
				details: 'Le message a bien été mis à jour'
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
			const validationError = await verifyUserServerChannel(ctx, args)
			if (validationError) return validationError

			const message = await ctx.db
				.query('message')
				.filter(q => q.eq(q.field('_id'), args.messageId))
				.first()
			if (!message) return error.unknownMessage

			if (message.deleted) return error.messageDeleted
			if (args.userId !== message.userId) return error.messageNotAuthor

			await ctx.db.patch(args.messageId, {
				modifiedAt: Date.now(),
				deleted: true
			})

			return {
				status: 'success',
				code: 200,
				message: 'MESSAGE_DELETED',
				details: 'Le message a bien été supprimé'
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

async function verifyUserServerChannel(
	ctx: MutationCtx | QueryCtx,
	{ userId, serverId, channelId }: { userId: Id<'user'>; serverId: Id<'server'>; channelId: Id<'channel'> }
) {
	const user = await ctx.db
		.query('user')
		.filter(q => q.eq(q.field('_id'), userId))
		.first()
	if (!user) return error.unknownUser

	const server = await ctx.db
		.query('server')
		.filter(q => q.eq(q.field('_id'), serverId))
		.first()
	if (!server) return error.unknownServer

	const member = await ctx.db
		.query('member')
		.filter(q => q.and(q.eq(q.field('userId'), userId), q.eq(q.field('serverId'), serverId)))
		.first()
	if (!member) return error.unknownMember

	const channel = await ctx.db
		.query('channel')
		.filter(q => q.eq(q.field('_id'), channelId))
		.first()
	if (!channel) return error.unknownChannel

	return null
}

const error = {
	unknownUser: {
		status: 'error',
		code: 404,
		message: 'UNKNOWN_USER',
		details: 'The specified user could not be found in the database'
	},
	unknownServer: {
		status: 'error',
		code: 404,
		message: 'UNKNOWN_SERVER',
		details: 'The specified server could not be found in the list of available servers'
	},
	unknownMember: {
		status: 'error',
		code: 404,
		message: 'UNKNOWN_MEMBER',
		details: 'The specified member is not part of the server'
	},
	unknownChannel: {
		status: 'error',
		code: 404,
		message: 'UNKNOWN_CHANNEL',
		details: 'The specified channel could not be found in the server'
	},
	unknownMessage: {
		status: 'error',
		code: 404,
		message: 'UNKNOWN_MESSAGE',
		details: 'The specified message could not be found in the channel'
	},
	messageEmpty: {
		status: 'error',
		code: 400,
		message: 'MESSAGE_EMPTY',
		details: 'The message content must contain at least one character'
	},
	messageTooLong: {
		status: 'error',
		code: 400,
		message: 'MESSAGE_TOO_LONG',
		details: 'The message exceeds the allowed character limit'
	},
	messageDeleted: {
		status: 'error',
		code: 410,
		message: 'MESSAGE_DELETED',
		details: 'The specified message has already been deleted and is no longer available'
	},
	messageNotAuthor: {
		status: 'error',
		code: 403,
		message: 'MESSAGE_NOT_AUTHOR',
		details: 'Only the author of the message can perform this action'
	},
	messageUnchanged: {
		status: 'error',
		code: 400,
		message: 'MESSAGE_UNCHANGED',
		details: 'The new message content must be different from the original'
	}
}
