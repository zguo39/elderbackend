function responseInfo(res, options) {
	let config = Object.assign({
		code: 0,
		codeText: 'OK!'
	}, options);

	res.status(200).type('application/json').send(config);
}

module.exports = {
	responseInfo,
}