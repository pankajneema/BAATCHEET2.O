import {StyleSheet,Text,View,ScrollView,KeyboardAvoidingView,TextInput,Pressable,Image,Alert} from "react-native";
  import React, { useState, useContext, useLayoutEffect, useEffect,useRef } from "react";
  import { Feather } from "@expo/vector-icons";
  import { Ionicons } from '@expo/vector-icons';
  import { FontAwesome } from "@expo/vector-icons";
  import { MaterialIcons } from "@expo/vector-icons";
  import { Entypo } from "@expo/vector-icons";
  import EmojiSelector from "react-native-emoji-selector";
  import { userType } from "../UserContext";
  import { useNavigation, useRoute } from "@react-navigation/native";
  import * as ImagePicker from "expo-image-picker";
  import WebSocketService from '../utility/WebSocketService';

  const ChatMessagesScreen = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [recepientData, setRecepientData] = useState();
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState("");
    const route = useRoute();
    const { recepientId } = route.params;
    const [message, setMessage] = useState("");
    const { userId, setUserId } = useContext(userType);
  
    const scrollViewRef = useRef(null);
  
    
  
    const scrollToBottom = () => {
        if(scrollViewRef.current){
            scrollViewRef.current.scrollToEnd({animated:false})
        }
    }
    useEffect(() => {
      scrollToBottom()
    },[]);

    const handleContentSizeChange = () => {
        scrollToBottom();
    }
  
    const handleEmojiPress = () => {
      setShowEmojiSelector(!showEmojiSelector);
    };
  
  // fetch  message from database 
  const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://192.168.2.190:8000/messages/${userId}/${recepientId}`
        );
        const data = await response.json();
  
        if (response.ok) {
          setMessages(data);
        } else {
          console.log("error showing messags", response.status.message);
        }
      } catch (error) {
        console.log("error fetching messages", error);
      }
    };
  
    useEffect(() => {
      fetchMessages();
      console.log("messages_pnkj",messages)
    }, []);
  
    //use Effect to recepient data 
    useEffect(() => {
      const fetchRecepientData = async () => {
        try {
          const response = await fetch(
            `http://192.168.2.190:8000/user/${recepientId}`
          );
  
          const data = await response.json();
          setRecepientData(data);
        } catch (error) {
          console.log("error retrieving details", error);
        }
      };
  
      fetchRecepientData();
    }, []);


    const handleSend = async (messageType, imageUri) => {
      try {
        const formData = new FormData();
        formData.append("senderId", userId);
        formData.append("recepientId", recepientId);
         
        console.log(message)
        if (message || imageUri){
        //if the message type id image or a normal text
        if (messageType === "image") {
          formData.append("messageType", "image");
          formData.append("imageFile", {
            uri: imageUri,
            name: "image.jpg",
            type: "image/jpeg",
          });
        } else {
          console.log("|<---------{ Sending Message }---------->|")
          formData.append("messageType", "text");
          formData.append("messageText", message);
          const websocket_message = {"messaging_product": "baatcheet", "recipient_type": "individual","senderId":{"_id":userId},"recepientId":recepientId, "type": "text", "text": { "body": message } }
          WebSocketService.sendMessage(websocket_message)
        }
        const response = await fetch("http://192.168.2.190:8000/messages", {
          method: "POST",
          body: formData,
        });
        
       
        console.log("|<---------{ Sending Message Completed }---------->|")
        if (response.ok) {
          setMessage("");
          setSelectedImage("");
  
          fetchMessages();
        }
    }
    if (message == ""){
        Alert.alert
    }
      } catch (error) {
        console.log("error in sending the message", error);
      }
    };
  
    console.log("messages", selectedMessages);
    
    useLayoutEffect(() => {
        
      navigation.setOptions({
        headerTitle: "",
        headerLeft: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
              color="black"
            />
  
            {selectedMessages.length > 0 ? (
              <View>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  {selectedMessages.length}
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
                  
                  source={{ uri: recepientData?.image }}
                />
  
                <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                  {recepientData?.name}
                </Text>
              </View>
            )}
          </View>
        ),
        headerRight: () =>
          selectedMessages.length > 0 ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
               <Ionicons name="arrow-undo" size={24} color="black" />
               <Ionicons name="arrow-redo" size={24} color="black" />
              <FontAwesome name="star" size={24} color="black" />
              <MaterialIcons
                onPress={() => deleteMessages(selectedMessages)}
                name="delete"
                size={24}
                color="black"
              />
            </View>
          ) : null,
      });
    }, [recepientData, selectedMessages]);
  
    const deleteMessages = async (messageIds) => {
      try {
        const response = await fetch("http://192.168.2.190:8000/deleteMessages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: messageIds }),
        });
  
        if (response.ok) {
          setSelectedMessages((prevSelectedMessages) =>
          prevSelectedMessages.filter((id) => !messageIds.includes(id))
        );
  
          fetchMessages();
        } else {
          console.log("error deleting messages", response.status);
        }
      } catch (error) {
        console.log("error deleting messages", error);
      }
    };
    const formatTime = (time) => {
      const options = { hour: "numeric", minute: "numeric" };
      return new Date(time).toLocaleString("en-US", options);
    };
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(result);
      let imageUri = result.assets[0].uri;  
      if (!result.canceled) {
        handleSend("image", imageUri);
      }
    };
    const handleSelectMessage = (message) => {
      //check if the message is already selected
      const isSelected = selectedMessages.includes(message._id);
  
      if (isSelected) {
        setSelectedMessages((previousMessages) =>
          previousMessages.filter((id) => id !== message._id)
        );
      } else {
        setSelectedMessages((previousMessages) => [
          ...previousMessages,
          message._id,
        ]);
      }
    };
    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
        <ScrollView ref={scrollViewRef} contentContainerStyle={{flexGrow:1,}} onContentSizeChange={handleContentSizeChange}>
          {messages.map((item, index) => {
            if (item.messageType === "text") {
              const isSelected = selectedMessages.includes(item._id);
              return (
                <Pressable
                  onLongPress={() => handleSelectMessage(item)}
                  key={index}
                  style={[
                    item?.senderId?._id === userId
                      ? {
                          alignSelf: "flex-end",
                          backgroundColor: "#DCF8C6",
                          paddingVertical:3,
                          paddingHorizontal:10,
                          maxWidth: "70%",
                          borderRadius: 7,
                          marginTop: 5,
                          marginRight:20,
                          
                    
                        }
                      : {
                          alignSelf: "flex-start",
                          backgroundColor: "white",
                          paddingVertical:3,
                          paddingHorizontal:10,
                          // margin:100,
                          marginTop: 5,
                          marginLeft:20,
                          borderRadius: 7,
                          maxWidth: "60%",
                        },
  
                    isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      // marginEnd: 15,
                      textAlign: isSelected ? "right" : "left",
                    }}
                  >
                    {item?.message}{"   "}
                    <Text
                      style={{
                        fontSize: 13,
                        color: "gray",
                        alignItems: 'flex-end',
                        textAlign: 'right',           
                      }}
                    >
                      {formatTime(item.timeStamp)}
                    </Text>
                  </Text>
                  
                </Pressable>
              );
            }
  
            if (item.messageType === "image") {
              const baseUrl =
                "/pnkj/BAATCHEET2.O/Baatcheet/api/files/";
              const imageUrl = item.imageUrl;
              
              const filename = imageUrl.split("/").pop();
           
              const image_url = baseUrl + filename;
              const source = { uri: baseUrl + filename };
              return (
                <Pressable
                  key={index}
                  style={[
                    item?.senderId?._id === userId
                      ? {
                          alignSelf: "flex-end",
                          backgroundColor: "#DCF8C6",
                          padding: 8,
                          maxWidth: "60%",
                          borderRadius: 7,
                          marginTop: 5,
                          marginRight:20,
                        }
                      : {
                          alignSelf: "flex-start",
                          backgroundColor: "white",
                          padding: 8,
                          margin: 10,
                          borderRadius: 7,
                          maxWidth: "60%",
                          marginTop: 5,
                          marginLeft:20,
                        },
                  ]}
                >
                  <View>
                    <Image
                    //   source={source}
                    // source={require(image_url)}
                      source={{ uri: "image_url" }}
                      style={{ width: 200, height: 200, borderRadius: 7 }}
                      onError={(error) => console.error('Error loading image:', error)}

                    />
                    <Text
                      style={{
                        textAlign: "right",
                        fontSize: 9,
                        position: "absolute",
                        right: 10,
                        bottom: 7,
                        color: "white",
                        marginTop: 5,
                      }}
                    >
                      {formatTime(item?.timeStamp)}
                    </Text>
                  </View>
                </Pressable>
              );
            }
          })}
        </ScrollView>
  
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: "#dddddd",
            marginBottom: showEmojiSelector ? 0 : 25,
          }}
        >
          <Entypo
            onPress={handleEmojiPress}
            style={{ marginRight: 5 }}
            name="emoji-happy"
            size={24}
            color="gray"
          />
  
          <TextInput
            value={message}
            onChangeText={(text) => setMessage(text)}
            style={{
              flex: 1,
              height: 40,
              borderWidth: 1,
              borderColor: "#dddddd",
              borderRadius: 20,
              paddingHorizontal: 10,
            }}
            placeholder="Type Your message..."
          />
  
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginHorizontal: 8,
            }}
          >
            <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
  
            <Feather name="mic" size={24} color="gray" />
          </View>
  
          <Pressable
            onPress={() => handleSend("text")}
            style={{
              backgroundColor: "#007bff",
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
          </Pressable>
        </View>
  
        {showEmojiSelector && (
          <EmojiSelector
            onEmojiSelected={(emoji) => {
              setMessage((prevMessage) => prevMessage + emoji);
            }}
            style={{ height: 250 }}
          />
        )}
      </KeyboardAvoidingView>
    );
  };
  
  export default ChatMessagesScreen;
  
  const styles = StyleSheet.create({});