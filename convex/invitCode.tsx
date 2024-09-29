import { MutationCtx } from './_generated/server'
import { mutation } from './_generated/server'
import { v } from 'convex/values'
import error from './errors'

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
		creatorId: v.id('user'),
		serverId: v.id('server'),
		maxUses: v.optional(v.number()),
		expiresAt: v.optional(v.number())
	},
	handler: async (ctx, { creatorId, serverId, maxUses, expiresAt }) => {
		try {
			const user = await ctx.db.get(creatorId)
			if (!user) return error.unknownUser
			const server = await ctx.db.get(serverId)
			if (!server) return error.unknownServer

			const codeGen = await generateCode(ctx)

			await ctx.db.insert('invitCode', {
				serverId: serverId,
				creatorId: creatorId,
				code: codeGen,
				uses: 0,
				maxUses: maxUses,
				expiresAt: expiresAt
			})

			return {
				status: 'success',
				code: 200,
				message: 'CODE_CREATED',
				details: "Le code d'invitation a bien été créé",
				data: codeGen
			}
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
			if (!invitCode) return error.invalidInviteCode

			const { serverId, maxUses, uses, expiresAt } = invitCode

			if (expiresAt !== undefined && expiresAt < Date.now()) return error.inviteCodeExpired
			if (maxUses !== undefined && maxUses > 0 && uses >= maxUses) return error.inviteCodeMaxUsesExceeded

			const server = await ctx.db
				.query('server')
				.filter(q => q.eq(q.field('_id'), serverId))
				.first()
			if (!server) return error.unknownServer

			await ctx.db.insert('member', {
				serverId: serverId,
				userId: args.userId
			})

			await ctx.db.patch(invitCode._id, { uses: invitCode.uses + 1 })

			return {
				status: 'success',
				code: 200,
				message: 'CODE_USED',
				details: "Le code d'invitation a bien été utilisé"
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
