//TODO: Fetch Code

//* POST
// eslint-disable-next-line no-unused-vars
async function postData(url, data) {
	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
	return response.json();
}
//! *****************************
