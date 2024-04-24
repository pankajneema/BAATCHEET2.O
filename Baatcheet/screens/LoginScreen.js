import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ViewBase, TextInput, Pressable } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    
    // this is effect for that if user toke  exits then user direct redirect to homescreen after close the app 
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    navigation.replace("Home");
                }
            } catch (error) {
                console.log("Error picking data from local storage - ", error);
            }
        }
    
        checkLoginStatus();
    }, []); 
    
    // this fucntiojn to hit login Api on login button pressed.
    const handleLogin = () =>{
        try{
         const user = {
            email :email,
            password:password
         }
    
         //Hit Login api 
    axios.post("http://192.168.0.172:8000/login",user).then((response) => {
            console.log("User login Api Response == "+JSON.stringify(response.data));
            const token = response.data.token;
            AsyncStorage.setItem("authToken",token)

            navigation.replace("Home");
      }).catch((error) => {
          console.log("User Login Error From Api == "+ error);
      })  
    }
    catch(err){
        console.log("Error in login -- ",err);
    }
    }
    return (
        <View style={{ flex: 2, backgroundColor: "white", padding: 10, alignItems: "center" }}>
            <KeyboardAvoidingView>
                <View style={{ marginTop: 100, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "#4A55A2", fontSize: 25, fontWeight: "600" }}>Sign In</Text>
                    <Text style={{ fontSize: 17, fontWeight: "600", marginTop: 10 }} >Sign In to Your Account</Text>

               
                </View>
                <View style={{ marginTop: 50, justifyContent: "center", alignItems: "center" }}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "grey" }}> Email </Text>
                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            style={{
                                fontSize: email ? 18 : 15,
                                borderBottomColor: "grey",
                                borderBottomWidth: 1,
                                marginVertical: 6,
                                width: 300
                            }}
                            placeholderTextColor={"black"}
                            placeholder='enter your email' />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "grey" }}> password </Text>
                        <TextInput
                            value={password}
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                            style={{
                                fontSize: password ? 18 : 15,
                                borderBottomColor: "grey",
                                borderBottomWidth: 1,
                                marginVertical: 6,
                                width: 300
                            }}
                            placeholderTextColor={"black"}
                            placeholder='enter your password' />
                    </View>

                   
                    <Pressable onPress={handleLogin} style={{width: 200, backgroundColor: "#4A55A2", padding: 15, marginTop: 50, borderRadius: 6}}>
                        <Text style={{color: 'white', textAlign: 'center',fontSize:16,fontWeight:"bold"}}>
                            Login
                        </Text>
                    </Pressable>

                    <Pressable onPress={() => {navigation.navigate("Register")}}  style={{ marginTop: 15 }} >
                        <Text style={{color:"grey",fontSize:16}}>Don't have an accoun? Sign Up </Text>
                    </Pressable>                   
                </View> 
            </KeyboardAvoidingView>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({})
