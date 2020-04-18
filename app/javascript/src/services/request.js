let securityHeader = {
	'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
}

let headers = {
	'Content-Type': 'application/json',
	...securityHeader
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

const upload = async (url, files) => {
  const fileData = files.reduce((formData, file) => {
  	formData.append('files[]', file)
  	return formData
  }, new FormData())
  	
  const response = await fetch( url, {
  	headers: securityHeader,
	method: 'POST',
	body: fileData
  })
  if (!response.ok) throw await response.json()
  return response.json()
}

export {
	get,
	post,
	put,
	destroy,
	upload
}