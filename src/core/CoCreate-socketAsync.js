const WebSocket = require('ws')
const {checkToken} = require("./utils")

const location = {};
location.protocol = "";

const CoCreateSocketAsync = {
	socket: null,

	/**
	 * config: {namespace, room, host}
	 */
	create: function(config) {
		
		return new Promise(function(resolve, reject) {
			const {namespace, room, prefix} = config;
			if (prefix) {
				this.prefix = prefix;
			}
			
			function getKey(namespace, room, prefix) {
				let key = prefix;
				if (namespace && namespace != '') {
					if (room &&  room != '') {
						key += `/${namespace}/${room}`;
					} else {
						key +=`/${namespace}`;
					}
				}
				return key;
			}
			
			const key = getKey(namespace, room, this.prefix);
			
			const protocol = location.protocol === 'http:' ? 'ws' : 'wss';
			let socket_url = `${protocol}://${location.host}/${key}`;
			if (config.host) {
				socket_url = `${protocol}://${config.host}/${key}`;
			}

			let socket;
			
			socket = new WebSocket(socket_url);
			
			socket.onopen = function(event) {
				console.log('created socket')
				resolve(socket);
			}
			
			socket.onerror = function(err) {
				
				console.log('---------------------')
				reject(err);
			};
		})

	},
	
	receive: function(socket, type, uniqueId) {
		return new Promise((resolve, reject) => {
			socket.onmessage = function(data) {
				try {
					let rev_data = JSON.parse(data.data);
					if (rev_data.action == type && checkToken(rev_data.data, uniqueId)) {
						resolve(rev_data)
					}
				} catch (e) {
					resolve(null);
				}
			}
			
			socket.onerror = function(err) {
				console.log('---------------------')
				reject(err);
			};
			
		})
	},
	
	close: function(socket) {
		return new Promise((resolve, reject) => {
			socket.onclose = function(event) {
				console.log('closed socket')
				resolve();
			} 
		})
	},
	
	/**
	 * 
	 */
	send: function(socket, action, data) {
		try {
			const obj = {
				action: action,
				data: data
			}
			if (socket) {
				socket.send(JSON.stringify(obj));
			}
		} catch (error) {
			throw error;
		}
	},
}

module.exports = CoCreateSocketAsync
