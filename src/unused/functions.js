function sliceIntoChunks(input, chunkSize) {
	return Array.from({length: Math.ceil( input.length / chunkSize )}, (v, i) => input.slice(i * chunkSize, i * chunkSize + chunkSize))
}

function sortByDate(input) {
	input = input.sort((a, b) => {
		return (new Date(b.date.created)).getTime() - (new Date(a.date.created)).getTime()
	})
	return input
}

function sortByName(input) {
	input = input.sort((a, b) => {
		if(a.firstName < b.firstName) return -1
		if(a.firstName > b.firstName) return 1
		return 0
	})
	return input
}

// export const pushPasswordChange = async (email, hash, password, password2) => {
// 	const response = await fetch(Config.BASEURL + '/resetpassword', {
// 		method: 'POST',
// 		headers: {
// 			'Accept': 'application/json',
// 			'Content-Type': 'application/x-www-form-urlencoded'
// 		},
// 		body: encodeURI(`email=${email}&hash=${hash}&password=${password}&password2=${password2}&context=mobile`)
// 	})
// 	console.log(response.text())
// 	return response.json()
// }
