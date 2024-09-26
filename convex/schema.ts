import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema(
	{
		// Serveurs
		server: defineTable({
			userId: v.string(), //							ID du créateur du serveur
			user: v.string(), //							Nom d'utilisateur du créateur
			name: v.string(), //							Nom du serveur
			ownerId: v.optional(v.string()), //				ID du propriétaire du serveur
			owner: v.optional(v.string()), //				Nom d'utilisateur du propriétaire
			description: v.optional(v.string()) //			Description optionnelle du serveur
		}),

		// Codes d'invitation
		invitCode: defineTable({
			serverId: v.id('server'),
			creatorId: v.string(), //						ID du créateur du code d'invitation
			code: v.string(), //							Code d'invitation
			uses: v.number(), //							Nombre d'utilisations
			maxUses: v.optional(v.number()), //				Nombre maximal d'utilisations
			expiresAt: v.optional(v.number()) //			Date d'expiration (timestamp)
		}),

		// Roles
		role: defineTable({
			serverId: v.id('server'), //					Identifiant du serveur auquel appartient ce rôle
			name: v.string(), //							Nom du rôle (par exemple: 'admin', 'modérateur', etc.)
			permissions: v.object({
				// Objet pour les permissions
				createChannel: v.boolean(),
				deleteChannel: v.boolean(),
				updateChannel: v.boolean(),
				manageRoles: v.boolean(),
				sendMessage: v.boolean(),
				deleteMessage: v.boolean()
			}),
			createdBy: v.string() // ID de l'utilisateur qui a créé ce rôle (doit être admin)
		}),

		// Membres des serveurs
		member: defineTable({
			serverId: v.id('server'),
			userId: v.string(), //							ID de l'utilisateur
			role: v.optional(v.id('role')) //					Rôle du membre (admin, modérateur, etc.)
		}),

		// Salons textuels dans les serveurs
		channel: defineTable({
			serverId: v.id('server'),
			name: v.string(), //							Nom du canal
			type: v.optional(v.string()), //				Type du canal (texte, vocal, etc.)
			permissions: v.optional(v.string()) //			Permissions spécifiques du canal (JSON string ou autre structure)
		}),

		// Messages envoyés dans les salons
		message: defineTable({
			channelId: v.id('channel'),
			userId: v.string(), //							ID de l'utilisateur qui a envoyé le message
			content: v.string(), //							Contenu du message
			modified: v.boolean(), //						Le message a-t-il été modifié ?
			modifiedAt: v.union(v.number(), v.null()), //	Timestamp de modification
			deleted: v.boolean() //							Le message a-t-il été supprimé ?
		})
	},
	{ schemaValidation: true }
)
