const ServerCrud = require("./index.js")
/**
 * Socket init 
 */


console.log('---------------------------')
console.log(ServerCrud);

const socket_config = {
    "config": {
        "apiKey": "c2b08663-06e3-440c-ef6f-13978b42883a",
        "securityKey": "f26baf68-e3a9-45fc-effe-502e47116265",
        "organization_Id": "5de0387b12e200ea63204d6c",
    },
    "prefix": "ws",
    "host": "server.cocreate.app:8088"
}
ServerCrud.SocketInit(socket_config)




/**
 * Store data into dab
 */

  /*
  CreateDocument({
    namespace:'',
    room:'',
    broadcast: true/false, (default=ture)
    broadcast_sender: true/false, (default=true) 
    collection: "test123",
    data:{
    	name1:“hello”,
    	name2:  “hello1”
    },
    metaData: any
  }, config),
  */
  
ServerCrud.CreateDocument({
	collection: "server-crud",
	broadcast_sender: true,
	broadcast: false,
	data: {
		"name": "CoCreate Server CRUD",
		"version": "0.0.1",
		"organization_id": socket_config.config.organization_Id
	},
	
}, socket_config.config);

ServerCrud.listen('createDocument', function(data) {
	console.log(data)
	
	ServerCrud.SocketDestory(socket_config);
});
