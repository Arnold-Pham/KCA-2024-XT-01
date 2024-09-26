import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const c = mutation({
	args: {
		serverId: v.id('server'),
		userId: v.string(),
		role: v.optional(v.id('role'))
	},
	handler: async (ctx, args) => {
		try {
			const server = await ctx.db
				.query('server')
				.filter(q => q.eq(q.field('_id'), args.serverId))
				.first()
			if (!server) return errors.serverNotFound

			await ctx.db.insert('member', {
				serverId: args.serverId,
				userId: args.userId,
				role: args.role
			})

			return {
				status: 'success',
				code: 200,
				message: 'Member added'
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
	handler: async (ctx, args) => {
		try {
			const server = await ctx.db
				.query('server')
				.filter(q => q.eq(q.field('_id'), args.serverId))
				.first()
			if (!server) return errors.serverNotFound

			const members = await ctx.db
				.query('member')
				.filter(q => q.eq(q.field('serverId'), args.serverId))
				.collect()

			return {
				status: 'success',
				code: 200,
				message: 'Members collected',
				data: members
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

// Le update est juste pour les permissions et les roles ... TBD

export const d = mutation({
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
			if (!server) return errors.serverNotFound

			const member = await ctx.db
				.query('member')
				.filter(q => q.eq(q.field('_id'), args.userId))
				.first()
			if (!member) return errors.memberNotFound

			await ctx.db.delete(member._id)

			return {
				status: 'success',
				code: 200,
				message: "Channel deleted and all it's messages too"
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
	}
}
