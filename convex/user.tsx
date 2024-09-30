import { mutation, query } from './_generated/server'
import { error, handleError } from './errors'
import { v } from 'convex/values'

export const cu = mutation({
	args: {
		authId: v.string(),
		username: v.string()
	},
	handler: async (ctx, { authId, username }) => {
		try {
			if (!username || username.trim() === '') return error.usernameEmpty
			if (username.trim().length < 2) return error.usernameTooShort
			if (username.trim().length > 20) return error.usernameTooLong

			const user = await ctx.db
				.query('user')
				.filter(q => q.eq(q.field('authId'), authId))
				.first()

			if (!user) {
				await ctx.db.insert('user', { username, authId })

				return {
					status: 'success',
					code: 200,
					message: 'USER_INFORMATIONS_CREATED',
					details: 'The user successfully added his informations'
				}
			}

			await ctx.db.patch(user._id, { username })

			return {
				status: 'success',
				code: 200,
				message: 'USER_INFORMATIONS_UPDATED',
				details: 'The user successfully updated his informations'
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const ga = query({
	args: {
		authId: v.string()
	},
	handler: async (ctx, { authId }) => {
		try {
			const user = await ctx.db
				.query('user')
				.filter(q => q.eq(q.field('authId'), authId))
				.first()

			if (!user) return error.unknownUser

			return {
				status: 'success',
				code: 200,
				message: 'USER_RETRIEVED',
				details: 'The user informations has been successfully retrieved',
				data: user
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const gu = query({
	args: {
		userId: v.string()
	},
	handler: async (ctx, { userId }) => {
		try {
			const user = await ctx.db
				.query('user')
				.filter(q => q.eq(q.field('_id'), userId))
				.first()

			if (!user) return error.unknownUser

			return {
				status: 'success',
				code: 200,
				message: 'USER_RETRIEVED',
				details: 'The user informations has been successfully retrieved',
				data: user
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})
