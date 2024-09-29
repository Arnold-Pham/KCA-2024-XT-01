import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import error from './errors'

export const c = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server')
	},
	handler: async (ctx, { userId, serverId }) => {
		try {
			const user = await ctx.db.get(userId)
			if (!user) return error.unknownUser
			const server = await ctx.db.get(serverId)
			if (!server) return error.unknownServer

			await ctx.db.insert('member', {
				serverId: serverId,
				userId: userId
			})

			return {
				status: 'success',
				code: 200,
				message: 'MEMBER_ADDED',
				details: "L'utilisateur a bien été ajouté en tant que membre du serveur"
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const l = query({
	args: {
		serverId: v.id('server')
	},
	handler: async (ctx, { serverId }) => {
		try {
			const server = await ctx.db.get(serverId)
			if (!server) return error.unknownServer

			const members = await ctx.db
				.query('member')
				.filter(q => q.eq(q.field('serverId'), serverId))
				.collect()

			return {
				status: 'success',
				code: 200,
				message: 'MEMBERS_GATHERED',
				details: 'La liste des membres du serveur on été récupérés',
				data: members
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
			if (!user) return error.unknownUser
			const server = await ctx.db.get(serverId)
			if (!server) return error.unknownServer

			const member = await ctx.db
				.query('member')
				.filter(q => q.eq(q.field('userId'), userId))
				.first()
			if (!member) return error.userNotMember

			await ctx.db.delete(member._id)

			return {
				status: 'success',
				code: 200,
				message: 'MEMBER_DELETED',
				details: "L'utilisateur a bien été retiré du serveur"
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
