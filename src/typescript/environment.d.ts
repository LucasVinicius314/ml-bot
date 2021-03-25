declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TOKEN: string
			NODE_ENV: 'development' | 'production'
			PORT?: string
		}
	}
}

export {}
