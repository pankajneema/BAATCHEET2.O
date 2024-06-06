import React, { useEffect, useState,useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, Alert } from 'react-native';
import { userType } from '../UserContext';
import axios, { Axios } from 'axios';
import { useNavigation } from '@react-navigation/native';

const FriendRequest = ({ item,friendRequests ,setFriendRequests }) => {
    const { userId, setUserId } = useContext(userType);
    const navigation = useNavigation();
    const deleteFriendRequest = async (friendRequestId) => {
        try{
            const response = await fetch("http://192.168.2.190:8000/friend-request/delete",
            {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  senderId: friendRequestId,
                  recepientId: userId,
                }),
              });
              console.log("RESPONSE FO DELTION API",response);
              if (response.ok) {
                setFriendRequests(
                  friendRequests.filter((request) => request._id !== friendRequestId)
                );
                 Alert.alert("Friend Request", "Friend Request deleted successfully.");
              }
        }catch(error){
            console.log("Error in delted frind request",error);
        }

    }
   


    const acceptFriendRequest = async (friendRequestId) => {
        try{
          console.log("STRATED================");
            const response = await fetch("http://192.168.2.190:8000/friend-request/accept",
            {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  senderId: friendRequestId,
                  recepientId: userId,
                }),
              });
              console.log("RESPONSE OF ACCEPT FRIEND REQUEST API",response);
              if (response.ok) {
                setFriendRequests(
                  friendRequests.filter((request) => request._id !== friendRequestId)
                );
                 Alert.alert("Friend Request", "Friend Request Accepted successfully.");
                 navigation.navigate("Chats")
              }
        }catch(error){
            console.log("Error in Accept   frind request",error);
        }

    }

    return (
        <Pressable style={{ flexDirection: "row", alignItems: "center", marginVertical: 10, backgroundColor: "#f0f2f5" }}>
        <Image style={{ width: 60, height: 60, borderRadius: 30 }} source={{ uri: item.image }} />
        <View style={{ marginLeft: 10, flex: 1 }}>
             <View style={{ flexDirection: "row", marginTop: 5 }}>
                 <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item?.name}  sent you a friend request</Text>
             </View>
             
            <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Pressable
                    onPress={() => acceptFriendRequest(item._id)}
                    style={{ backgroundColor: "#0062b2", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, marginRight: 10 }}>
                    <Text style={{ color: "white", fontSize: 14, fontWeight: "bold",textAlign:"center" }}>Accept</Text>
                </Pressable>
                <Pressable
                    onPress={() => deleteFriendRequest(item._id)}
                    style={{ backgroundColor: "#e4e6eb", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 }}>
                    <Text style={{ color: "#333", fontSize: 14, fontWeight: "bold",textAlign:"center" }}>Delete Request</Text>
                </Pressable>
            </View>
        </View>
    </Pressable>
    
    )
}

export default FriendRequest;


const styles = StyleSheet.create({})
