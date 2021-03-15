const ServerCrud = require("./index.js")
/**
 * Socket init 
 */


const socket_config = {
    "config": {
        "apiKey": "c2b08663-06e3-440c-ef6f-13978b42883a",
        "securityKey": "f26baf68-e3a9-45fc-effe-502e47116265",
        "organization_Id": "5de0387b12e200ea63204d6c",
    },
    "prefix": "ws",
    "host": "server.cocreate.app:8088"
};

async function runFunc() {
  try {
    let socket = await ServerCrud.SocketInitAsync(socket_config);
    let data = null;
    if (socket) {
      // data = await ServerCrud.ReadDocument(
      //         socket, 
      //         {
      //           collection: "server-crud",
      //           document_id: "603fce3c89f1ed08c4505a21"
      //         }, 
      //         socket_config.config
      //       );

      data = await ServerCrud.ReadDocumentListAsync(
              socket, 
              {
                collection: "server-crud",
                // is_collection: false,
                // operator: {
                //   filters: [],
                //   orders: [],
                //   startIndex: 0,
                //   search: {
                //     type: 'or',
                //     value: []
                //   }
                // }
              }, 
              socket_config.config
            );
      
     	await ServerCrud.SocketDestoryAsync(socket)
     	data = data.data;
    }
    return data;
  } catch (error) {
    return null;
  }
}

runFunc().then((data)  => console.log(data))
        .catch((error) => console.log(error))
