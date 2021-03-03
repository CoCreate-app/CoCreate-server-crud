const CoCreateSocket = require('./CoCreate-socket')

let socket = null;

function makeCommonParam(config) {
	return {
		"apiKey":           config.apiKey,
		"securityKey":      config.securityKey,
		"organization_id":  config.organization_Id,
	}
}

module.exports.SocketInit = function (socketConfig) {
	console.log(socketConfig)
	
	socket = CoCreateSocket.create({
		namespace: socketConfig.config.organization_Id,
		room: null,
		host: socketConfig.host,
		prefix: socketConfig.prefix
	})
	CoCreateSocket.setGlobalScope(socketConfig.config.organization_Id);
	return socket;
}

module.exports.SocketDestory = function(socketConfig) {
	let key = CoCreateSocket.getKey(socketConfig.config.organization_Id, null);
	CoCreateSocket.destroyByKey(key)
}

//. CreateDocument
module.exports.CreateDocument = function (info, config) {
	if (info === null) return;
	
	let commonParams = makeCommonParam(config)
	
	let request_data = {...info, ...commonParams};
	CoCreateSocket.send('createDocument', request_data, '')
}

//. DeleteDocument
module.exports.ReadDocument = function(info, config) {
	if (info === null) return;
	
	let commonParams = makeCommonParam(config)
	
	if (!info['document_id'] || !info) {
    	return;
    }
    
    let request_data = {...info, ...commonParams};
    CoCreateSocket.send('readDocument', request_data)
}

module.exports.UpdateDocument = function (info, config) {
	if (info === null) return;
	
	let commonParams = makeCommonParam(config)
	
	let request_data = {...commonParams};
	
	if (!info.collection || !info.document_id ) return;
	
	request_data['set'] = info.data;
	request_data['collection'] = info.collection
	request_data['document_id'] = info.document_id
	request_data['metadata'] = info['metadata']
	request_data['upsert'] = true;
	request_data['broadcast'] = false;

	CoCreateSocket.send('updateDocument', request_data, '');	
}

module.exports.DeleteDocument = function(info, config) {
	if (info === null) return;
	let commonParams = makeCommonParam(config)
	if (!info['document_id'] || !info) {
    	return;
    }
    
    let request_data = {...info, ...commonParams};
    CoCreateSocket.send('deleteDocument', request_data)
}


module.exports.listen = function(message, fun) {
	CoCreateSocket.listen(message, fun);
}


