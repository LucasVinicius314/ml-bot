import { Message } from 'discord.js'

export type CommandHandler = (
	command: string,
	next: () => string,
	statements: string[],
	message: Message
) => void
