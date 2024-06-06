// this socket server to handle realtime communication || --- 

const WebSocket = require('ws');
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');

const jwt = require("jsonwebtoken");
clientMappping = {};

//init empty dict to store socket accordigly user id
async function connectToMongoDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://neemapankaj123:TrYSTs85o6NE4imY@cluster0.xbfr9yj.mongodb.net/Baatcheet",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error in connecting to MongoDB:", err);
  }
}

//function to check auth request is right then return true elase false if true then insert in clientMapping Dict
async function verify_auth_request(token,wsclient){
  try{
     
    const decodeToken =  jwt.decode(token);
    console.log("Decoded Token : ",decodeToken);
   // cehck user exitsin db or not if not then retrun false
   const result = await mongoose.connection.db.collection('users')
   .findOne({ _id: new ObjectId(decodeToken.userId) });
  
   //  console.log("Result from auth -- ",result);        
   if(result){
       clientMappping[decodeToken.userId] = wsclient;
       return true;       
   }
   else{
    return false;
   }
  }catch(error){
    console.log("Error in Verify Auth Request : ",error);
    return false;
  }
}

async function verify_user(user_id){
  try{
    console.log("Searching the user :: ",user_id);
    const result = await mongoose.connection.db.collection('users')
    .findOne({ _id: new ObjectId(user_id) });
    if (result){
      return true
    }else{
      return false
    }
  }catch(error){
    console.log("Error in verify user : ",error);
    return new Error(error);
  }
}
class WebSocketServer {
  constructor(port) {
    this.port = port;
    connectToMongoDB();
    this.server = null;
  }

  start() {
    this.server = new WebSocket.Server({ port: this.port });
    this.server.on('connection', (client) => {
      try{
        console.log("|<-------  New Conntection strat ------->|")
        client.on('message', (message) => {
        console.log('Received message:', message);       
        const data  =   JSON.parse(message);
        
        //check for auth request  || if new coneection was creating by user
        if (data.messaging_product === "auth_request") {
          try {
             if (verify_auth_request(data.metadata.token,client)){
              const return_data = { "messaging_product": "auth_response", "statuses": { "status": "success", "timestamp": Date.now(), "messages":{"code":"200","title":"valid token"}}} 
              console.log(return_data);
              const jsonString = JSON.stringify(return_data);
              client.send(jsonString);
             }else{
              const return_data = { "messaging_product": "auth_response", "statuses": { "status": "failed", "timestamp": Date.now(), "errors":{"code":"400",'title':"Invalid token"}}}
              console.log(return_data); 
              const jsonString = JSON.stringify(return_data);
              client.send(jsonString);
             }
             console.log("|<------- New Conntection Request Complted ------->|");
             console.log("Total LoggedIn Clients : ",Object.keys(clientMappping).length );  
              // Do something after verification, if needed
          } catch (error) {
            console.error("Error while verifying auth request:", error);
            const return_data = { "messaging_product": "auth_response", "statuses": { "status": "failed", "timestamp": Date.now(), "errors":{"code":"500",'title':error}}}
            const jsonString = JSON.stringify(return_data);
            client.send(jsonString);
              }
        }
      
      // check for message thats need to send one use to another || individual user means only P2P 
      else if (data.messaging_product == 'baatcheet' && data.recipient_type == "individual"){
          try{
              //checking where the user whom the message id to send is user of our app
              verify_user(data.recepientId)
              .then(verify_user_result => {
                    console.log("Result From User Verification :: ", verify_user_result);
                      // Further operations with verify_user_result here
                    if (verify_user_result instanceof Error) { //if any error in geting user details 
                      const return_data = { "messaging_product": "baatcheet","statuses": { "status": "failed", "timestamp": Date.now(),"recipient_id": data.recipientId, "errors":{"code":"500",'title':verify_user_result.message}}}
                      const jsonString = JSON.stringify(return_data);
                      client.send(jsonString);
                    }else if (!verify_user_result){  // The person to whom the message has to be sent is not a user of our app.
                      const return_data = { "messaging_product": "baatcheet","statuses": { "status": "failed", "timestamp": Date.now(),"recipient_id": data.recipientId, "errors":{"code":"1026",'title':"Message Undeliverable."}}}
                      const jsonString = JSON.stringify(return_data);
                      client.send(jsonString);
                    }else if (verify_auth_request){
                        //Checking whether the user to whom the message is to be sent is currentlly logged in or not.
                        if (!(data.recepientId in clientMappping)) {
                          console.log("Warninng :: This User Currently not logged In : ",data.recepientId);
                          //TODO SEND MESSAGE IN A QUEUE AND WHEN USER LOGGED IN THEN SEND ALL MESSAGE THATS IN USER"S QUEUE
                        }else{
                          //Get the WebSocket object of the user to whom the message is to be sent.
                          const usesWebsocketObject  = clientMappping[data.recepientId]

                          //check websocket object is connected or alive 
                          if (usesWebsocketObject.readyState === WebSocket.OPEN){
                            const jsonString = JSON.stringify(data);
                            usesWebsocketObject.send(jsonString);
                          }
                        }
                    }
                    })
              .catch(error => {
                console.error("Error occurred during user verification:", error);
              })   
            }catch (error){
              console.log("BIG ERROR ::: Error in Hanlde Mssage ",error);
            }
          }
      });

     ;}
     catch(err){
      console.log("Error in Reciving messages : ",err);
     }
    });

    console.log('WebSocket server started on port', this.port);
  }
  
  sendToUser(messagejson){
    try{
        

    }catch(error){
      console.log("Erorr in send Message to User : ",error)
    }
  }
  stop() {
    this.server.close();
    console.log('WebSocket server stopped');
  }
}
 
const port = 12345;
const host = '192.168.2.190'; // Specify your desired IP address here
const server = new WebSocketServer(port, host);
server.start();

// Graceful shutdown
process.on('SIGINT', () => {
  server.stop();
  process.exit();
});
