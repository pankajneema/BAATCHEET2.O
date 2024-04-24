import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ViewBase, TextInput, Pressable, Alert } from 'react-native';

const RegisterScreen = () => {
    const [name,setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const navigation = useNavigation();

    const handleRegister = () => {

        const user = {
            name:name,
            email:email,
            password:password,
            image:image
        }
        console.log(user);
        // hit user registration api
        axios.post("http://192.168.0.172:8000/register",user).then((response) => {
            console.log("User Registration Api Response == " + JSON.stringify(response.data));
              Alert.alert("Registration Successfull",
              "You have been registered successfully");
              navigation.navigate("Login");
            //   name = ("");
            //   email = ("");
            //   password = ("");
            //   image = ("");
              
        }).catch((error) => {
            console.log("User Registration Error From Api == ",error);
            Alert.alert("Registration Failed",
            "An Error occoured while registering");    
        })



    }

    return (
        <View style={{ flex: 2, backgroundColor: "white", padding: 10, alignItems: "center" }} >
          <KeyboardAvoidingView>
                <View style={{ marginTop: 100, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "#4A55A2", fontSize: 25, fontWeight: "600" }}>Register </Text>
                    <Text style={{ fontSize: 17, fontWeight: "600", marginTop: 10 }} >Register to Your Account</Text>
                </View>

                <View style={{ marginTop: 50, justifyContent: "center", alignItems: "center" }}>
                    
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "grey" }}> Name </Text>
                        <TextInput
                            value={name}
                            onChangeText={(text) => setName(text)}
                            style={{
                                fontSize: email ? 18 : 15,
                                borderBottomColor: "grey",
                                borderBottomWidth: 1,
                                marginVertical: 3,
                                width: 300
                            }}
                            placeholderTextColor={"black"}
                            placeholder='Enter your name' />
                    </View>
                    
                    <View style={{marginTop:15}}>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "grey" }}> Email </Text>
                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            style={{
                                fontSize: email ? 18 : 15,
                                borderBottomColor: "grey",
                                borderBottomWidth: 1,
                                marginVertical: 3,
                                width: 300
                            }}
                            placeholderTextColor={"black"}
                            placeholder='Enter your email' />
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
                                marginVertical: 3,
                                width: 300
                            }}
                            placeholderTextColor={"black"}
                            placeholder='Enter your password' />
                    </View>
                    
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "grey" }}> Image </Text>
                        <TextInput
                            value={image}
                            onChangeText={(text) => setImage(text)}
                            style={{
                                fontSize: password ? 18 : 15,
                                borderBottomColor: "grey",
                                borderBottomWidth: 1,
                                marginVertical: 3,
                                width: 300
                            }}
                            placeholderTextColor={"black"}
                            placeholder='enter your Image' />
                    </View>

                    <Pressable onPress={handleRegister} style={{width: 200, backgroundColor: "#4A55A2", padding: 15, marginTop: 50, borderRadius: 6}}>
                        <Text style={{color: 'white', textAlign: 'center',fontSize:16,fontWeight:"bold"}}>
                            Register
                        </Text>
                    </Pressable>

                    <Pressable onPress={() => {navigation.navigate("Login")}}  style={{ marginTop: 15 }} >
                        <Text style={{color:"grey",fontSize:16}}>Already have an accoun? Sign In </Text>
                    </Pressable>    

                </View> 

            </KeyboardAvoidingView>
        </View>
    );
};

export default RegisterScreen;

const styles =  StyleSheet.create({})
