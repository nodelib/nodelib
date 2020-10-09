const url = require('url');

// const http = require('../infratest/node_modules/@yandex-int/si.ci.requests');
const http = require('./packages/http/http.requests').default;

const searchParams = new url.URLSearchParams();

searchParams.append('token', '<value>');

(async () => {
	const response = await http('http://canonium.com/qwe', {
		searchParams
	});

	console.dir(response.body.length, { colors: true });
})();

// const stream = http.stream('http://canonium.com/qwe', {
// 	searchParams,
// });

// stream.on('data', () => {
// 	console.log('data');
// });

// stream.on('error', () => {
// 	console.log('error');
// });

// stream.on('close', () => {
// 	console.log('done');
// });
