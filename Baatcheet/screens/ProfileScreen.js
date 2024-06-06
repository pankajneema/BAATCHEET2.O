import { StyleSheet, Text,TextInput, View ,ScrollView,Alert,TouchableOpacity,Pressable,Image, Dimensions ,Button} from "react-native";
import React, { useContext,useEffect,useState } from "react";
import { userType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Zocial } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';


const ProfileScreen = () => {
  
  const { userId, setUserId } = useContext(userType);
  const navigation = useNavigation();
  const [userData , setUserData] =  useState("");
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const handleNameChange = (inputText) => {
    setName(inputText);
  };
  const handleEmailChange = (inputText) => {
    setEmail(inputText);
  };

    

  //Fetch User Details 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://192.168.2.190:8000/user/${userId}`
        );

        const data = await response.json();
        setUserData(data);
        setName(data.name)
        setEmail(data.email)
        setMobile(data.mobile)
      } catch (error) {
        console.log("error retrieving details", error);
      }
    };

    fetchUserData();
  }, []);

  console.log("User Profile Data -- ",userData);
  return (

    // View Profile
    <View>
            <View style={{ justifyContent: 'center', alignItems: 'center' ,flexDirection:"row"}}>
                <Image
                style={{
                    width: screenWidth * 0.45, // 50% of the screen width
                    height: screenHeight * 0.20, // 75% of the screen height
                    marginTop:40,
                    borderRadius: 90,
                }}
                source={{ uri: userData?.image }}
                />
                <TouchableOpacity
                style={{
                    position: 'absolute', 
                    top: 170, 
                    right: 120, 
                    backgroundColor: '#4A55A2',
                    padding: 10,
                    borderRadius: 25,
                    // zIndex: 1, // Higher z-index to ensure the button is above the image
                }}
                    onPress={() => {
                        Alert.alert(
                            'Change Profile',
                            'Are You Want To Update you profile image ?',
                            [
                            {
                                text: 'No',
                                onPress: () => Alert.alert('nhi chnage krni thi to click kyu kara'),
                                style: 'cancel',
                            },
                            {
                                text: 'Yes',
                                onPress: () => Alert.alert('Abhi nhi chalata Sorry  But phle DP kyu aachi nhi lagayi'),
                                style: 'cancel',
                            },
                            ],
                            {
                            cancelable: true,
                            onDismiss: () =>
                                Alert.alert(
                                'Kya kar liya hata kar',
                                ),
                            },
                        );
                        
                    }}
                    
                ><Feather name="camera" size={24} style={{justifyContent: 'center',alignItems: 'center', color:"white" }}  color="black" /></TouchableOpacity>
          </View>
            
            {/* NAME */}
          <View style={{ flexDirection: 'row', paddingLeft: screenHeight * 0.06, marginTop: screenHeight * 0.05 }}>
            <FontAwesome5 name="user" size={20} color="#4A55A2" style={{ marginRight: 5, marginTop: 30 }} />
            <Text style={{ fontSize: 16 ,marginLeft:screenHeight * 0.03, marginTop: 25 }}>Name</Text>
            </View>
            <TextInput
                style={{  marginRight:screenHeight * 0.15,marginLeft:screenHeight * 0.11,paddingHorizontal:5 ,fontSize:20,fontWeight:"bold"}}
                value={name}
                placeholder="Your Name"
                onChangeText={handleNameChange}
            />

            {/* EMAIL */}
            <View style={{ flexDirection: 'row', paddingLeft: screenHeight * 0.06}}>
            <Fontisto name="email" size={20} color="#4A55A2" style={{ marginRight: 5, marginTop: 25 }} />
            <Text style={{ fontSize: 16 ,marginLeft:screenHeight * 0.03, marginTop: 25 }}>Email </Text>
            </View>
            <TextInput
                style={{  marginRight:screenHeight * 0.13,marginLeft:screenHeight * 0.11, borderBottomWidth: 0, paddingHorizontal:5 ,fontSize:20,fontWeight:"bold"}}
                value={email}
                onChangeText={handleEmailChange}
                placeholder="Your Email"
            />
            
            {/* Phone */}
            <View style={{ flexDirection: 'row', paddingLeft: screenHeight * 0.06}}>
            <Feather name="phone" size={20} color="#4A55A2" style={{ marginRight: 5, marginTop: 25 }} />
            <Text style={{ fontSize: 16 ,marginLeft:screenHeight * 0.03, marginTop: 25 }}>Phone </Text>
            </View>
            <TextInput
                style={{  marginRight:screenHeight * 0.13,marginLeft:screenHeight * 0.11, borderBottomWidth: 0, paddingHorizontal:5 ,fontSize:20,fontWeight:"bold"}}
                value= {mobile}
                // onChangeText={handleEmailChange} TODO PANKAJ ADD PHONE NUMBER
                placeholder="Your Phone Number"
            />
        <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        console.log('You tapped the button!');
                    }}
                >
                    <Text style={styles.buttonText}>Save Profile  🙂‍</Text>
                </TouchableOpacity>
    </View>
   
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    button: {
        padding: 10,
        backgroundColor: '#4A55A2',
        alignItems: 'center',
        marginTop: 50,
        marginLeft: 60, 
        marginRight: 60, // You can adjust this value according to your requirements
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});