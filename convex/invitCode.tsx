import { MutationCtx } from './_generated/server'
import { mutation } from './_generated/server'
import { v } from 'convex/values'

const generateCode = async (ctx: MutationCtx, length: number = 12): Promise<string> => {
	const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	let code = ''

	while (true) {
		for (let i = 0; i < length; i++) code += charset[Math.floor(Math.random() * charset.length)]

		const existingCode = await ctx.db
			.query('invitCode')
			.filter(q => q.eq('code', code))
			.first()
		if (!existingCode) return code
	}
}

export const c = mutation({
	args: {
		serverId: v.id('server'),
		creatorId: v.string(),
		maxUses: v.optional(v.number()),
		expiresAt: v.optional(v.number())
	},
	handler: async (ctx, args) => {
		try {
			// Ajouter vérifications permission invitations
			const codeGen = await generateCode(ctx)

			await ctx.db.insert('invitCode', {
				serverId: args.serverId,
				creatorId: args.creatorId,
				code: codeGen,
				uses: 0,
				maxUses: args.maxUses,
				expiresAt: args.expiresAt
			})

			return { status: 'success', code: 200, message: 'Code created', data: codeGen }
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const use = mutation({
	args: {
		code: v.string(),
		userId: v.id('user')
	},
	handler: async (ctx, args) => {
		try {
			const invitCode = await ctx.db
				.query('invitCode')
				.filter(q => q.eq(q.field('code'), args.code))
				.first()
			if (!invitCode) return errors.invalid

			const { serverId, maxUses, uses, expiresAt } = invitCode

			if (expiresAt !== undefined && expiresAt < Date.now()) return errors.expired
			if (maxUses !== undefined && maxUses > 0 && uses >= maxUses) return errors.maxUsed

			const server = await ctx.db
				.query('server')
				.filter(q => q.eq(q.field('_id'), serverId))
				.first()
			if (!server) return errors.serverNotFound

			await ctx.db.insert('member', {
				serverId: serverId,
				userId: args.userId
			})

			await ctx.db.patch(invitCode._id, { uses: invitCode.uses + 1 })

			return { status: 'success', code: 200, message: 'Code used' }
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
	invalid: {
		status: 'error',
		code: 404,
		message: 'Unknown code'
	},
	maxUsed: {
		status: 'error',
		code: 400,
		message: 'Code usage limit reached'
	},
	serverNotFound: {
		status: 'error',
		code: 404,
		message: 'Server not found',
		details: 'The specified Server does not exist'
	},
	expired: {
		status: 'error',
		code: 400,
		message: 'Code expired'
	}
}
