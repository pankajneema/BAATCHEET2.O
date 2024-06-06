import AsyncStorage from '@react-native-async-storage/async-storage';

// WebSocketService.js
class WebSocketService {
    messageCallback = null;
    connect(token) {
      this.socket = null;
      this.isConnected = false;
      this.url = "ws://192.168.2.190:12345";
      this.token = null;
        url = this.url;
      if (!this.isConnected) {
        // Close existing connection if any
        this.close();
  
        this.token = token;
        this.socket = new WebSocket(url);
  
        this.socket.onopen = () => {
          console.log('WebSocket connection established.');

          // send Event to authauthorized with socekt server 
          message =   `{"messaging_product":"auth_request", "metadata":{"token":"${token}"}}`   //'messaging_product'
          this.socket.send(message);
          this.isConnected = true;
        };

        this.socket.onmessage = (event) => {
          console.log('Received message:', event.data);
          const event_data  =   JSON.parse(event.data)
          
          if (event_data.messaging_product === 'auth_response' && event_data.statuses.status === 'success'){
             console.log('Sucessfully contect with scoekt server:', event.data);
              this.isConnected = true;
          }else if (event_data.messaging_product == 'baatcheet' && event_data.recipient_type == "individual"){
            console.log("recive Chat mnessage : ",event_data)

          }
          // Handle received messages here
        };
  
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        this.socket.onclose = () => {
          console.log('WebSocket connection closed.');
          this.isConnected = false;
          // Optionally handle reconnection logic here
          this.connect(this.token); // Reconnect
        };
      } else {
        console.log('WebSocket connection already established.');
      }
    }
  
    
    sendMessage(message) {
      console.log("|<------------ sending message by WebSocket to User -------->|");
      if (!this.isConnected) {
        console.log('Connecting to WebSocket...');
        this.connect(this.token);
      }
  
      if (this.socket && this.isConnected) {
       const ff =  JSON.stringify(message)
        this.socket.send(ff);
      } else {
        console.warn('WebSocket connection not established.');
      }
      console.log("|<------------ sending message by WebSocket to User Completed -------->|");
    }
  
    close() {
      if (this.socket) {
        this.socket.close();
        this.isConnected = false;
        this.url = null;
      }
    }
  }
  
  export default new WebSocketService();
  