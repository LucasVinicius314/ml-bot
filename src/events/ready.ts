import * as colors from 'colors'

const listener = () => {
	console.log(colors.green(`Client ready`))
}

export { listener as ready }
