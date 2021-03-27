import * as colors from 'colors'

import { compile, fit, load, model, predict, stop } from '../models/groups'

import { Message } from 'discord.js'
import { help } from '../commands/help'
import { parse } from '../commands/parse'

const listener = async (message: Message) => {
	if (message.author.bot) return
	const statements = message.content.split(' ')
	const next = () => statements.shift()
	const command = next()
	switch (command) {
		case 'help':
			help(command, next, statements, message)
			break
		case 'parse':
			parse(command, next, statements, message)
			break
		case 'compile':
			compile()
			message.reply('Model compiled.')
			break
		case 'fit':
			await fit()
			message.reply('Model trained.')
			break
		case 'predict':
			const res = predict(JSON.parse(next()))
			message.reply('Predicted.')
			message.reply(res.toString())
			break
		case 'stop':
			stop()
			message.reply('Stopped.')
			break
		case 'load':
			load()
			message.reply('Loaded.')
			break
		case 'a':
			compile()
			await fit()
			predict([1, 2, 3])
			message.reply('Predicted.')
			break
		default:
			message.channel.send('Command not identified.')
			break
	}
}

export { listener as message }
