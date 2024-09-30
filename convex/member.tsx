import { error, handleError, verifyUSMC } from './errors'
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const c = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server')
	},
	handler: async (ctx, { userId, serverId }) => {
		try {
			const validationError = await verifyUSMC(ctx, { userId, serverId })
			if (validationError) return validationError

			await ctx.db.insert('member', {
				serverId: serverId,
				userId: userId
			})

			return {
				status: 'success',
				code: 200,
				message: 'MEMBER_ADDED',
				details: 'The user has been successfully added as a server member'
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
			const validationError = await verifyUSMC(ctx, { serverId })
			if (validationError) return validationError

			const members = await ctx.db
				.query('member')
				.filter(q => q.eq(q.field('serverId'), serverId))
				.collect()

			return {
				status: 'success',
				code: 200,
				message: 'MEMBERS_GATHERED',
				details: 'The server members list has been successfully retrieved',
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
			const validationError = await verifyUSMC(ctx, { userId, serverId })
			if (validationError) return validationError

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
				details: 'The user has been successfully removed from the server'
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})
