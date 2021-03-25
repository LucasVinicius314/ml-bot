import * as colors from 'colors'

import { Message } from 'discord.js'

const listener = (message: Message) => {
	if (message.author.bot) return
	message.reply('.')
}

export { listener as message }
