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
      data = await ServerCrud.ReadDocumentAsync(
              socket, 
              {
                collection: "server-crud",
                document_id: "603fce3c89f1ed08c4505a21"
              }, 
              socket_config.config
            );
      
      // console.log('data1 --->', data);
      // data = await ServerCrud.ReadDocumentAsync(
      //         socket, 
      //         {
      //           collection: "render_test",
      //           document_id: "5f5aeace3a7246b7cf2e4002"
      //         }, 
      //         socket_config.config
      //       );
      // console.log('data2 --->', data)
     	await ServerCrud.SocketDestoryAsync(socket)
    }
    return data;
  } catch (error) {
    return null;
  }
}

runFunc().then((data)  => console.log(data))
        .catch((error) => console.log(error))
