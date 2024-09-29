import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import error from './errors'

export const c = mutation({
	args: {
		userId: v.id('user'),
		name: v.string(),
		description: v.optional(v.string())
	},
	handler: async (ctx, { userId, name, description }) => {
		try {
			if (!name || name.trim() === '') return error.serverNameEmpty
			if (name.trim().length > 50) return error.serverNameTooLong

			const user = await ctx.db.get(userId)
			if (!user) return error.unknownUser

			const server = await ctx.db.insert('server', {
				userId: userId,
				name: name.trim(),
				description: description
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
				details: 'Le serveur a bien été créé, avec un channel "General"'
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
			const user = await ctx.db.get(userId)
			if (!user) return error.unknownUser

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
				details: 'La liste des serveurs a été récupérée',
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
			const user = await ctx.db.get(userId)
			if (!user) return // Pas de user
			const server = await ctx.db.get(serverId)
			if (!server) return // pas de serveur
			if (userId !== server.userId && userId !== server.ownerId) return // pas le proprio

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
				details: 'Le serveur, ses membres, ses channels et ses messages ont été supprimés;'
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
