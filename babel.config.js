module.exports = function (api) {
	api.cache(true)
	const presets = [
		[
			'@babel/preset-env',
			{
				'modules': false,
				'targets': {
					'browsers': [
						'last 2 versions',
						' > 5%'
					],
					'esmodules': false
				}
			}
		]
	]
	const plugins = [
		[
			'@babel/transform-runtime'
		],
		// ['@babel/plugin-transform-classes'],
		// ['@babel/plugin-proposal-class-properties'],
		['@babel/plugin-transform-modules-commonjs'],
		['@babel/plugin-proposal-object-rest-spread', { 'loose': true, 'useBuiltIns': true }]
	]

	return {
		presets,
		plugins
	}
}