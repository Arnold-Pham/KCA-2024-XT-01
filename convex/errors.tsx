const errorArray = {
	unknownUser: {
		status: 'error',
		code: 404,
		message: 'UNKNOWN_USER',
		details: 'The specified user could not be found in the database'
	},
	usernameEmpty: {
		status: 'error',
		code: 400,
		message: 'USERNAME_EMPTY',
		details: 'The username cannot be empty'
	},
	usernameTooShort: {
		status: 'error',
		code: 400,
		message: 'USERNAME_TOO_SHORT',
		details: 'The username must be at least 3 characters long'
	},
	usernameTooLong: {
		status: 'error',
		code: 400,
		message: 'USERNAME_TOO_LONG',
		details: 'The username cannot exceed 20 characters'
	},
	pictureInvalidUrl: {
		status: 'error',
		code: 400,
		message: 'PICTURE_INVALID_URL',
		details: 'The picture URL is invalid'
	},
	authIdEmpty: {
		status: 'error',
		code: 400,
		message: 'AUTH_ID_EMPTY',
		details: 'The authentication ID cannot be empty'
	},
	unknownServer: {
		status: 'error',
		code: 404,
		message: 'UNKNOWN_SERVER',
		details: 'The specified server could not be found in the database'
	},
	serverNameEmpty: {
		status: 'error',
		code: 400,
		message: 'SERVER_NAME_EMPTY',
		details: 'The server name cannot be empty'
	},
	serverNameTooShort: {
		status: 'error',
		code: 400,
		message: 'SERVER_NAME_TOO_SHORT',
		details: 'The server name must be at least 3 characters long'
	},
	serverNameTooLong: {
		status: 'error',
		code: 400,
		message: 'SERVER_NAME_TOO_LONG',
		details: 'The server name cannot exceed 50 characters'
	},
	serverDescriptionTooLong: {
		status: 'error',
		code: 400,
		message: 'SERVER_DESCRIPTION_TOO_LONG',
		details: 'The server description cannot exceed 200 characters'
	},
	serverNotOwned: {
		status: 'error',
		code: 403,
		message: 'SERVER_NOT_OWNED',
		details: 'You do not have permission to perform this action on the server'
	},
	invalidInviteCode: {
		status: 'error',
		code: 400,
		message: 'INVALID_INVITE_CODE',
		details: 'The provided invite code is invalid'
	},
	inviteCodeExpired: {
		status: 'error',
		code: 410,
		message: 'INVITE_CODE_EXPIRED',
		details: 'The invite code has expired and cannot be used'
	},
	inviteCodeMaxUsesExceeded: {
		status: 'error',
		code: 410,
		message: 'INVITE_CODE_MAX_USES_EXCEEDED',
		details: 'The maximum number of uses for this invite code has been reached'
	},
	memberAlreadyExists: {
		status: 'error',
		code: 409,
		message: 'MEMBER_ALREADY_EXISTS',
		details: 'The user is already a member of this server'
	},
	unknownChannel: {
		status: 'error',
		code: 404,
		message: 'UNKNOWN_CHANNEL',
		details: 'The specified channel could not be found in the database'
	},
	channelNameEmpty: {
		status: 'error',
		code: 400,
		message: 'CHANNEL_NAME_EMPTY',
		details: 'The channel name cannot be empty'
	},
	channelNameTooLong: {
		status: 'error',
		code: 400,
		message: 'CHANNEL_NAME_TOO_LONG',
		details: 'The channel name cannot exceed 50 characters'
	},
	channelTypeInvalid: {
		status: 'error',
		code: 400,
		message: 'CHANNEL_TYPE_INVALID',
		details: 'The specified channel type is invalid, allowed types are "text" and "vocal"'
	},
	unknownMessage: {
		status: 'error',
		code: 404,
		message: 'UNKNOWN_MESSAGE',
		details: 'The specified message could not be found in the database'
	},
	messageEmpty: {
		status: 'error',
		code: 400,
		message: 'MESSAGE_EMPTY',
		details: 'The message content cannot be empty'
	},
	messageTooLong: {
		status: 'error',
		code: 400,
		message: 'MESSAGE_TOO_LONG',
		details: 'The message content exceeds the maximum allowed length of 1000 characters'
	},
	messageUnchanged: {
		status: 'error',
		code: 400,
		message: 'MESSAGE_UNCHANGED',
		details: 'No changes were made to the message content'
	},
	messageDeleted: {
		status: 'error',
		code: 410,
		message: 'MESSAGE_DELETED',
		details: 'The message has been deleted and cannot be accessed'
	},
	userNotAuthorized: {
		status: 'error',
		code: 403,
		message: 'USER_NOT_AUTHORIZED',
		details: 'You do not have the necessary permissions to perform this action'
	}
}
