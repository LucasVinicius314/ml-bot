import * as colors from 'colors'
import * as model from '../models/groups'

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
		case 'train':
			await model.train()
			message.reply('Model trained.')
			break
		case 'predict':
			const res = model.predict(JSON.parse(next()))
			message.reply('Predicted.')
			message.reply(res.toString())
			break
		case 'stop':
			model.stop()
			message.reply('Stopped.')
			break
		case 'load':
			model.load()
			message.reply('Loaded.')
			break
		case 'all':
			model.load()
			await model.train()
			const _res = model.predict([
				'F',
				'F',
				'F',
				'F',
				'F',
				'F',
				'F',
				'F',
				'F',
				'F',
				'F',
				'F',
				'F',
			])
			message.reply('Predicted.')
			message.reply(_res)
			break
		default:
			message.channel.send('Command not identified.')
			break
	}
}

export { listener as message }
