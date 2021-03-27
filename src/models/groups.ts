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

const choiceToInt = (val: string | number) => {
	switch (val) {
		case 0:
			return 0
		case 'N':
			return 0
		case 'F':
			return 1
		case 3:
			return 2
		case 2:
			return 2
		case 1:
			return 3
	}
}

const profileToInt = (val: string) => {
	switch (val) {
		case 'C':
			return 0
		case 'D':
			return 1
		case 'E':
			return 2
		case 'I':
			return 3
	}
}

const intToProfile = (val: number) => {
	switch (val) {
		case 0:
			return 'C'
		case 1:
			return 'D'
		case 2:
			return 'E'
		case 3:
			return 'I'
	}
}

let _data: Row[] = []

const LEARNING_RATE = 0.1
const EPOCHS = 200
const FEATURES = 13

const model = tf.sequential()

model.add(tf.layers.dense({ units: 1, inputShape: [FEATURES] }))

model.compile({
	optimizer: tf.train.adam(LEARNING_RATE),
	loss: tf.losses.meanSquaredError,
	metrics: ['accuracy'],
})

export const train = async () => {
	const data = _data.filter((v) => v['#'] !== '' && v.Perfil !== '')

	const xs = data.map((v) => [
		choiceToInt(v.deficientes),
		choiceToInt(v.dificuldadeEscolha),
		choiceToInt(v.fakeNews),
		choiceToInt(v.faltaConhecimentoDigital),
		choiceToInt(v.faltaDeEducacao),
		choiceToInt(v.faltaInstrucaoIdosos),
		choiceToInt(v.faltaPontosColeta),
		choiceToInt(v.financasFamiliares),
		choiceToInt(v.informacaoDesenvolvimento),
		choiceToInt(v.informacaoSegura),
		choiceToInt(v.informacaoShow),
		choiceToInt(v.oportunidadesTI),
		choiceToInt(v.organizacaoClinicas),
	])
	const ys = data.map((v) => profileToInt(v.Perfil))

	let xTrain = tf.tensor2d(xs, [xs.length, FEATURES])
	let yTrain = tf.tensor2d(ys, [ys.length, 1])

	await model.fit(xTrain, yTrain, {
		epochs: EPOCHS,
		callbacks: {
			onEpochEnd: (epoch, logs) => {
				console.log(`epoch ${epoch}: ${logs.loss}`)
			},
		},
	})
}

export const predict = (xs: string[]) => {
	const _input = [xs.map((v) => choiceToInt(v))]
	const _shape = [_input.length, FEATURES] as [number, number]
	const input = tf.tensor2d(_input, _shape)
	const predictOut = (model.predict(input) as tf.Tensor).dataSync()
	const strOut: string[] = []
	predictOut.forEach((v: number) => strOut.push(intToProfile(Math.round(v))))
	return strOut.toString()
}

export const stop = () => {
	model.stopTraining = true
}

export const load = () => {
	const loadedData = TSV.parse(
		fs.readFileSync('data/groups.tsv', { encoding: 'utf8' })
	) as Row[]
	_data = loadedData
	fs.writeFileSync('data/groups.json', JSON.stringify(loadedData))
}
