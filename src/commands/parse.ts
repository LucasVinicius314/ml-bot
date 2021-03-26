import { CommandHandler } from '../typescript'
import { Message } from 'discord.js'
import { parser } from '../services/parser'

const parse: CommandHandler = (
	command: string,
	next: () => string,
	statements: string[],
	message: Message
) => {}

export { parse }
