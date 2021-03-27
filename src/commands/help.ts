import { Message, MessageEmbed } from 'discord.js'

import { CommandHandler } from '../typescript'

const commands: { name: string; description: string }[] = [
	{
		name: 'help',
		description: 'Displays information about all available commands.',
	},
	{
		name: 'parse',
		description: 'Parses data into a file.',
	},
	{
		name: 'train',
		description: 'Train the model.',
	},
	{
		name: 'predict',
		description: 'Make predictions from the model.',
	},
	{
		name: 'stop',
		description: "Stop the model's training.",
	},
	{
		name: 'all',
		description: 'Go train and predict using the model.',
	},
	{
		name: 'load',
		description: 'Load data into the model.',
	},
]

const help: CommandHandler = (
	command: string,
	next: () => string,
	statements: string[],
	message: Message
) => {
	const embed = new MessageEmbed()
	embed.setTitle('Help')
	embed.setDescription('Listing of all commands available')
	embed.setTimestamp()
	commands.forEach((v) => {
		embed.addField(v.name, v.description)
	})
	embed.setFooter(
		`Requested by ${message.author.username}`,
		message.author.avatarURL()
	)
	message.channel.send(embed)
}

export { help }
