require('esbuild').build({
	entryPoints: {
		client: './src/extension.js',
		server: './node_modules/@evmts/language-server/dist/nodeServer.js',
	},
	bundle: true,
	metafile: process.argv.includes('--metafile'),
	outdir: './dist',
	external: [
		'vscode',
	],
	format: 'cjs',
	platform: 'node',
	tsconfig: './tsconfig.json',
	define: { 'process.env.NODE_ENV': '"production"' },
	minify: process.argv.includes('--minify'),
	plugins: [
		{
			name: 'umd2esm',
			setup(build) {
				build.onResolve({ filter: /^(vscode-.*|estree-walker|jsonc-parser)/ }, args => {
					const pathUmdMay = require.resolve(args.path, { paths: [args.resolveDir] })
					// Call twice the replace is to solve the problem of the path in Windows
					const pathEsm = pathUmdMay.replace('/umd/', '/esm/').replace('\\umd\\', '\\esm\\')
					return { path: pathEsm }
				})
			},
		},
	],
}).catch(() => process.exit(1))
