module.exports = {
	plugins: [
		require('postcss-import'),
		require('postcss-sorting'),
		require('postcss-preset-env')({ stage: 1 }),
		require('cssnano'),
	],
};
