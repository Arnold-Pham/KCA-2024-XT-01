import { error, handleError, verifyUSMC } from './errors'
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const c = mutation({
	args: {
		userId: v.id('user'),
		name: v.string(),
		description: v.optional(v.union(v.string(), v.null()))
	},
	handler: async (ctx, { userId, name, description }) => {
		try {
			if (!name || name.trim() === '') return error.serverNameEmpty
			if (name.trim().length > 50) return error.serverNameTooLong

			const validationError = await verifyUSMC(ctx, { userId })
			if (validationError) return validationError

			if (description && description.trim().length > 200) return error.serverDescTooLong

			const server = await ctx.db.insert('server', {
				userId: userId,
				name: name.trim(),
				description: description?.trim()
			})

			await ctx.db.insert('member', {
				serverId: server,
				userId: userId
			})

			await ctx.db.insert('channel', {
				serverId: server,
				name: 'General',
				type: 'text'
			})

			return {
				status: 'success',
				code: 200,
				message: 'SERVER_CREATED',
				details: 'The server has been successfully created with a "General" channel'
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const l = query({
	args: {
		userId: v.id('user')
	},
	handler: async (ctx, { userId }) => {
		try {
			const validationError = await verifyUSMC(ctx, { userId })
			if (validationError) return validationError

			const members = await ctx.db
				.query('member')
				.filter(q => q.eq(q.field('userId'), userId))
				.collect()

			const serverPromises = members.map(async member => {
				return await ctx.db
					.query('server')
					.filter(q => q.eq(q.field('_id'), member.serverId))
					.collect()
			})

			const servers = await Promise.all(serverPromises)

			return {
				status: 'success',
				code: 200,
				message: 'SERVER_GATHERED',
				details: 'The list of servers has been successfully retrieved',
				data: servers.flat()
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const d = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server')
	},
	handler: async (ctx, { userId, serverId }) => {
		try {
			const validationError = await verifyUSMC(ctx, { userId })
			if (validationError) return validationError

			const server = await ctx.db.get(serverId)
			if (!server) return error.unknownServer
			if (userId !== server.userId && userId !== server.ownerId) return error.userNotAuthorized

			const channels = await ctx.db
				.query('channel')
				.filter(q => q.eq(q.field('serverId'), serverId))
				.collect()

			for (const channel of channels) {
				const messages = await ctx.db
					.query('message')
					.filter(q => q.eq(q.field('channelId'), channel._id))
					.collect()

				for (const message of messages) await ctx.db.delete(message._id)
				await ctx.db.delete(channel._id)
			}

			const members = await ctx.db
				.query('member')
				.filter(q => q.eq(q.field('serverId'), serverId))
				.collect()
			for (const member of members) await ctx.db.delete(member._id)

			await ctx.db.delete(server._id)

			return {
				status: 'success',
				code: 200,
				message: 'SERVER_DELETED',
				details: 'The server, its members, channels, and messages have been successfully deleted'
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})
