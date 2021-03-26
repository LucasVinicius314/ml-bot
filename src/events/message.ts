import * as colors from 'colors'

import { Message } from 'discord.js'
import { help } from '../commands/help'
import { parse } from '../commands/parse'

const listener = (message: Message) => {
	if (message.author.bot) return
	const statements = message.content.split(' ')
	const next = statements.shift
	const command = statements[0]
	switch (command) {
		case 'help':
			help(command, next, statements, message)
			break
		case 'parse':
			parse(command, next, statements, message)
			break
		default:
			message.channel.send('Command not identified.')
			break
	}
}

export { listener as message }
