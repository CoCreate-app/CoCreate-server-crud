const CoCreateSocket = require('./CoCreate-socket')
const { makeCommonParam, generateUUID, setToken } = require("./utils")
const CoCreateSocketAsync = require("./CoCreate-socketAsync");


function makeUpdateData(info, config) {
	try {
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
		return request_data;
	} catch (err) {
		return null;
	}
}

function makeReadData(info, config) {
	if (info === null) return;
	
	let commonParams = makeCommonParam(config)
	
	if (!info['document_id'] || !info) {
    	return;
    }
    
    let request_data = {...info, ...commonParams};
    return request_data;
}


function makeCreateData(info, config) {
	if (info === null) return;
	let commonParams = makeCommonParam(config)
	if (info.data && !info.data.organization_id) {
		info.data.organization_id = config.organization_Id
	}
	let request_data = {...info, ...commonParams};
	return request_data;
}

function makeDeleteData(info, config) {
	if (info === null) return;
	let commonParams = makeCommonParam(config)
	if (!info['document_id'] || !info) {
    	return;
    }
    
    let request_data = {...info, ...commonParams};
    return request_data;
}

function makeReadList(info, config) {
	if (info === null) return;
	
	let commonParams = makeCommonParam(config)
	
	if (!info) {
    	return;
    }
    
    if (!info.operator) {
    	info.operator = {filters: [], orders: [], startIndex: 0, search: {}};
    } else {
    	if (!info.operator.filters) info.operator.filters = [];
    	if (!info.operator.orders) info.operator.orders = [];
    	if (!info.operator.startIndex) info.operator.startIndex = 0;
    	if (!info.operator.search) info.operator.search = {};
    }

    let request_data = {...info, ...commonParams};
    return request_data;
}


//. General CRUD functions
module.exports.SocketInit = function (socketConfig) {
	let socket = CoCreateSocket.create({
		namespace: socketConfig.config.organization_Id,
		room: null,
		host: socketConfig.host,
		prefix: socketConfig.prefix
	})
	CoCreateSocket.setGlobalScope(socketConfig.config.organization_Id);
}

module.exports.SocketDestory = function(socketConfig) {
	let key = CoCreateSocket.getKey(socketConfig.config.organization_Id, null);
	CoCreateSocket.destroyByKey(key)
}

module.exports.CreateDocument = function (info, config) {
	let request_data = makeCreateData(info, config)
	if (request_data) {
		CoCreateSocket.send('createDocument', request_data, '')
	}
}
//. DeleteDocument
module.exports.ReadDocument = function(info, config) {
	let request_data = makeReadData(info, config)
	if (request_data) {
	    CoCreateSocket.send('readDocument', request_data)
	}
}

module.exports.UpdateDocument = function (info, config) {
	let request_data = makeUpdateData(info, config)
	if (request_data) {
		CoCreateSocket.send('updateDocument', request_data, '');	
	}
}

module.exports.DeleteDocument = function(info, config) {
	let request_data = makeDeleteData(info, config);
	if (request_data) {
	    CoCreateSocket.send('deleteDocument', request_data)
	}
}


module.exports.listen = function(message, fun) {
	CoCreateSocket.listen(message, fun);
}


//. Async functon for one-time socket
module.exports.SocketInitAsync = async function(socketConfig) {
	try {
		let socket = await CoCreateSocketAsync.create({
			namespace: socketConfig.config.organization_Id,
			room: null,
			host: socketConfig.host,
			prefix: socketConfig.prefix	
		}) 
		return socket;	
	}
	catch (error) {
		console.log(error);
		return null;
	}
}

module.exports.ReadDocumentAsync = async function(socket, info, config) {
	try {
		if (!socket || !info) return null;

		let request_data = makeReadData(info, config)
		if (request_data) {
		    let data = await sendAndReceiveAsync(socket, 'readDocument', request_data);
		    return data;
		}
		return null;
		
	} catch (error) {
		console.log(error)
		return null;
	}
}
module.exports.CreateDocumentAsync = async function (socket, info, config) {
	try {
		if (!socket || !info) return null;

		let request_data = makeCreateData(info, config)
		if (request_data) {
			let data = await sendAndReceiveAsync(socket, 'createDocument', request_data);
			return data;
		}
		return null;
	} catch(error) {
		return null;
	}
}

module.exports.UpdateDocumentAsync = async function (socket, info, config) {
	try {
		
		if (!socket) return null;
		
		let request_data = makeUpdateData(info, config)
		if (request_data) {
			let data = await sendAndReceiveAsync(socket, 'updateDocument', request_data);
			return data;
		} else {
			return null;
		}
	} catch(error) {
		return null;
	}
}

module.exports.DeleteDocumentAsync = async function (socket, info, config) {
	try {
		if (!socket) return null;
		let request_data = makeDeleteData(info, config)

		if (request_data) {
			let data = await sendAndReceiveAsync(socket, 'deleteDocument', request_data);
			return data;
		} 
		return null;

	} catch(error) {
		return null;
	}
}

async function sendAndReceiveAsync(socket, type, data)
{
	try {
		let token = generateUUID();
		data = setToken(data, token)
		CoCreateSocketAsync.send(socket, type, data)
		return await CoCreateSocketAsync.receive(socket, type, token);
	} catch (error) {
		console.log(error)
		return null;
	}
}

module.exports.ReadDocumentListAsync = async function(socket, info, config) {
	try {
		if (!socket || !info) return null;
		let request_data = makeReadList(info, config)
		if (request_data) {
		    let data = await sendAndReceiveAsync(socket, 'readDocumentList', request_data);
		    return data;
		}
		return null;
		
	} catch (error) {
		console.log(error)
		return null;
	}
}

module.exports.SocketDestoryAsync = async function(socket) {
	try {
		socket.close();
		await CoCreateSocketAsync.close(socket);
		socket = null;
	} catch (error) {
		return false;
	}
}

module.exports.sendAndReceiveAsync = sendAndReceiveAsync;
