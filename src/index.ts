import 'dotenv/config'
import './utils/global'

import { message, ready } from './events'

import { Client } from 'discord.js'

const client = new Client()

client.on('ready', ready)

client.on('message', message)

client.login(process.env.TOKEN)
