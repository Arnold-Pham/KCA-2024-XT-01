import { error, handleError, verifyUSMC } from './errors'
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Ajouter la gestion du type
export const c = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		name: v.string()
	},
	handler: async (ctx, { name, userId, serverId }) => {
		try {
			if (!name || name.trim() === '') return error.channelNameEmpty
			if (name.trim().length > 32) return error.channelNameTooLong

			const validationError = await verifyUSMC(ctx, { userId, serverId })
			if (validationError) return validationError

			const channels = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('serverId'), serverId))
				.collect()
			if (channels.length >= 32) return error.tooManyChannels

			await ctx.db.insert('channel', {
				serverId,
				name: name.trim(),
				type: 'text'
			})

			return {
				status: 'success',
				code: 200,
				message: 'CHANNEL_CREATED',
				details: 'The channel has been successfully created'
			}
		} catch (error) {
			return handleError(error)
		}
	}
})

export const l = query({
	args: {
		userId: v.id('user'),
		serverId: v.id('server')
	},
	handler: async (ctx, { userId, serverId }) => {
		try {
			const validationError = await verifyUSMC(ctx, { userId, serverId })
			if (validationError) return validationError

			const channels = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('serverId'), serverId))
				.collect()

			return {
				status: 'success',
				code: 200,
				message: 'CHANNELS_GATHERED',
				details: 'Channel list has been successfully retrieved',
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
			if (!name && !type) return error.channelUnchanged
			if (name && (name.trim().length === 0 || name.trim() === '')) return error.channelNameEmpty
			if (name && name.trim().length > 32) return error.channelNameTooLong
			if (type && type !== 'text' && type !== 'vocal') return error.channelTypeInvalid

			const validationError = await verifyUSMC(ctx, { userId })
			if (validationError) return validationError

			const server = await ctx.db.get(serverId)
			if (!server) return error.unknownServer
			const channel = await ctx.db.get(channelId)
			if (!channel) return error.unknownChannel

			if (userId !== server.userId && userId !== server.ownerId) return error.userNotAuthorized

			await ctx.db.patch(channelId, {
				name: name?.trim() || channel.name,
				type: type || channel.type
			})

			return {
				status: 'success',
				code: 200,
				message: 'CHANNEL_UPDATED',
				details: 'The channel has been successfully updated'
			}
		} catch (error) {
			return handleError(error)
		}
	}
})

export const d = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		channelId: v.id('channel')
	},
	handler: async (ctx, { userId, serverId, channelId }) => {
		try {
			const validationError = await verifyUSMC(ctx, { userId, channelId })
			if (validationError) return validationError

			const server = await ctx.db.get(serverId)
			if (!server) return error.unknownServer
			if (userId !== server.userId && userId !== server.ownerId) return error.userNotAuthorized

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
				details: 'The channel and all associated messages have been deleted'
			}
		} catch (error) {
			return handleError(error)
		}
	}
})
