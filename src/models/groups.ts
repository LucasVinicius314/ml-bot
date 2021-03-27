import * as fs from 'fs'
import * as tf from '@tensorflow/tfjs'

import { TSV } from 'tsv'

type Choice = 'F' | 'N' | 0 | 1 | 2

type Row = {
	'#': number | ''
	Matrícula: number | ''
	Nome: string
	Perfil: 'E' | 'D' | 'C' | 'I' | ''
	faltaInstrucaoIdosos: Choice
	faltaPontosColeta: Choice
	faltaConhecimentoDigital: Choice
	dificuldadeEscolha: Choice
	informacaoShow: Choice
	fakeNews: Choice
	faltaDeEducacao: Choice
	financasFamiliares: Choice
	informacaoDesenvolvimento: Choice
	organizacaoClinicas: Choice
	deficientes: Choice
	informacaoSegura: Choice
	oportunidadesTI: Choice
}

type ProfileInt = 0 | 1 | 2 | 3

type ChoiceInt = 0 | 1 | 2 | 3

const profileToInt = {
	C: 0,
	D: 1,
	E: 2,
	I: 3,
}

const choiceToInt = {
	F: 1,
	N: 0,
	0: 0,
	1: 2,
	2: 3,
}

let data: Row[] = []

const model = tf.sequential()

model.add(tf.layers.dense({ units: 1, inputShape: [13], activation: 'linear' }))

const compile = () => {
	console.log('Compiling')
	model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' })
}

const fit = async () => {
	console.log('Fitting')

	const _data = data.filter((v) => v['#'] !== '' && v.Perfil !== '')

	const inputs = _data.map((v) => [
		choiceToInt[v.deficientes],
		choiceToInt[v.dificuldadeEscolha],
		choiceToInt[v.fakeNews],
		choiceToInt[v.faltaConhecimentoDigital],
		choiceToInt[v.faltaDeEducacao],
		choiceToInt[v.faltaInstrucaoIdosos],
		choiceToInt[v.faltaPontosColeta],
		choiceToInt[v.financasFamiliares],
		choiceToInt[v.informacaoDesenvolvimento],
		choiceToInt[v.informacaoSegura],
		choiceToInt[v.informacaoShow],
		choiceToInt[v.oportunidadesTI],
		choiceToInt[v.organizacaoClinicas],
	])
	const labels = _data.map((v) => profileToInt[v.Perfil]) as ProfileInt[]

	const xs = tf.tensor2d(inputs, [inputs.length, 13])
	const ys = tf.tensor2d(labels, [labels.length, 1])

	await model.fit(xs, ys, {
		epochs: 100,
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

const load = () => {
	const loadedData = TSV.parse(
		fs.readFileSync('data/groups.tsv', { encoding: 'utf8' })
	) as Row[]
	data = loadedData
	fs.writeFileSync('data/groups.json', JSON.stringify(loadedData))
}

export { model, compile, fit, predict, stop, load }
