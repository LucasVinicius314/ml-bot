import * as tf from '@tensorflow/tfjs'

const map: { input: number; label: number }[] = [
	{ input: 0, label: 0 },
	{ input: 1, label: 2 },
	{ input: 2, label: 4 },
	{ input: 3, label: 6 },
	{ input: 4, label: 8 },
	{ input: 5, label: 10 },
]

const model = tf.sequential()

model.add(tf.layers.dense({ units: 1, inputShape: [1], activation: 'linear' }))

const compile = () => {
	console.log('Compiling')
	model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' })
}

const fit = async () => {
	console.log('Fitting')

	const _a = tf.linspace(0, 999_999_999_999_999, 100000).arraySync()
	const greatest = _a.sort((a, b) => a - b)[_a.length - 1]
	const a = _a.map((v) => ({ input: v / greatest, label: (v * 2) / greatest }))

	const inputs = a.map((v) => v.input)
	const labels = a.map((v) => v.label)

	const xs = tf.tensor2d(inputs, [inputs.length, 1])
	const ys = tf.tensor2d(labels, [labels.length, 1])

	await model.fit(xs, ys, {
		epochs: 1e34,
		callbacks: {
			onEpochEnd: (epoch, log) => {
				console.log(`Epoch ${epoch}: loss = ${log.loss}`)
			},
		},
	})
}

const predict = (xs: number[]) => {
	const pred = model.predict(tf.tensor2d(xs, [xs.length, 1])) as tf.Tensor
	const res = pred.dataSync()
	console.log(res)
	return res.toString()
}

const stop = () => {
	model.stopTraining = true
}

export { model, compile, fit, predict, stop }
