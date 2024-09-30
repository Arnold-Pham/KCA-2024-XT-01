import { error, handleError, verifyUSMC } from './errors'
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
		creatorId: v.id('user'),
		serverId: v.id('server'),
		maxUses: v.optional(v.union(v.number(), v.null())),
		expiresAt: v.optional(v.union(v.number(), v.null()))
	},
	handler: async (ctx, { creatorId, serverId, maxUses, expiresAt }) => {
		try {
			const validationError = await verifyUSMC(ctx, { userId: creatorId, serverId })
			if (validationError) return validationError

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
				details: 'The invitation code has been successfully created',
				data: codeGen
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})

export const use = mutation({
	args: {
		userId: v.id('user'),
		code: v.string()
	},
	handler: async (ctx, args) => {
		try {
			const invitCode = await ctx.db
				.query('invitCode')
				.filter(q => q.eq(q.field('code'), args.code))
				.first()
			if (!invitCode) return error.inviteCodeInvalid

			const { serverId, maxUses, uses, expiresAt } = invitCode

			if (expiresAt && expiresAt < Date.now()) return error.inviteCodeExpired
			if (maxUses && maxUses > 0 && uses >= maxUses) return error.inviteCodeMaxUsesExceeded

			const validationError = await verifyUSMC(ctx, { serverId })
			if (validationError) return validationError

			await ctx.db.insert('member', {
				serverId: serverId,
				userId: args.userId
			})

			await ctx.db.patch(invitCode._id, { uses: invitCode.uses + 1 })

			return {
				status: 'success',
				code: 200,
				message: 'CODE_USED',
				details: 'The invitation code has been successfully used'
			}
		} catch (error: unknown) {
			return handleError(error)
		}
	}
})
