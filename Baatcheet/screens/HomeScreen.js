import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ViewBase, TextInput, Pressable ,Image} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { userType } from '../UserContext';
import jwt_decode from "jwt-decode";
import "core-js/stable/atob";
import User from '../components/User';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';


const HomeScreen = () => {

    const navigation = useNavigation();
    const { userId, setUserId } = useContext(userType)
    const [users, setUsers] = useState([]);
    const [profileImage ,setProfileImage]  = useState("");
   
    useEffect(() => {
        const fetchUsers= async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                const [header, payload, signature] = token.split('.');
                const decodedToken = JSON.parse(atob(payload));
        
                // Extract the userId from the decoded token
                const userId = decodedToken.userId;
                setUserId(userId);
                console.log("Decoded Token:", decodedToken);
                console.log("User ID:", userId);
                
                // Once userId is set, proceed with making the API call
                await axios.get(`http://192.168.2.190:8000/users/${userId}`).then((response) => {
                    console.log("Get All User Api Response == " + JSON.stringify(response.data));
                    setUsers(response.data);
                }).catch((error) => {
                    console.log("User error retrieving users Api == " + error);
                });

              await axios.get(`http://192.168.2.190:8000/profile-image/${userId}`).then((response) => {
                    console.log("Get User Profile Iameg URL == " + JSON.stringify(response.data));
                    setProfileImage(response.data);
                }).catch((error) => {
                    console.log("Error in User Profile Image URL == " + error);
                });

            } catch (error) {
                console.log("Error fetching or decoding token:", error);
            }
        };
         fetchUsers();
    }, []);

    console.log("Total Users -> ", users);

    console.log("User Profile pnkj",profileImage)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <Text style={{  fontSize: 25, fontWeight: "600" }} > Baatcheet</Text>
            ),
            headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons onPress={() => navigation.navigate("Chats")} name="logo-wechat" size={24} color="black" />
                    <FontAwesome5 onPress={() => navigation.navigate("Friends")} name="users" size={24} color="black" />

                    <Pressable onPress={() => navigation.navigate("Profile")}>
                    {profileImage ? (
                        <View style={{flexDirection:"row"}}>
                        <Image
                        style={{ width: 30, height: 30, borderRadius: 25, marginLeft: 10 }}
                        source={{ uri: profileImage }}
                        />
                        <Entypo name="dots-three-vertical" size={20} color="black" style={{paddingTop:5}}/>
                        </View>
                    ) : <FontAwesome name="user-circle-o" size={24} color="black" />}
                    </Pressable>

                </View>
            )
        })
    }, []);

    return (
        <View>
            <View style={{ padding: 17 }}>
            {users.map((item, index) => (
                    <User key={index} item={item}/>
                ))}
            </View>
            <Text>Home Screen </Text>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({})
