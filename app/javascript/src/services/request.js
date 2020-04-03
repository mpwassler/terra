let headers = {
	'Content-Type': 'application/json',
	'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
}

const request = async (url, method, data) => {
	let config = { method, headers }
	if (data) config['body'] = JSON.stringify(data)
  	const response = await fetch( url, config)
  	if (!response.ok) throw await response.json()
  	return response.json()
  	
}

const get     = (url)       => request(url, 'GET')
const post    = (url, data) => request(url, 'POST', data)
const put     = (url, data) => request(url, 'PUT', data)
const destroy = (url)       => request(url, 'DELETE')

export {
	get,
	post,
	put,
	destroy
}