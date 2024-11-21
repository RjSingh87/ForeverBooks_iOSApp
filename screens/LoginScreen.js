import { StyleSheet, Text, View, ImageBackground, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator} from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { fBTheme, token } from '../constant'
import Feather from 'react-native-vector-icons/Feather';
import { MyData } from '../Store';

const LoginScreen = ({navigation, route}) => {
    const screen = route.params?.screen
  const {logIn, loginStatus, uniqueID, addUserData} = useContext(MyData);
   const [userData, setUserData] = useState({
        email: "",
        password: "",
        secureTextEntry: true,
        check_textInputChange: false,
        isValidUser: true,
        isValidPassword: true,
        loginLoading: false,
        screenName:screen
    });
    function handleInputChange(val, type) {
        if (type == 'email') {
            if (val.trim().length >= 4) {
                setUserData({
                    ...userData,
                    email: val,
                    check_textInputChange: true,
                    isValidUer: true
                })
            } else {
                setUserData({
                    ...userData,
                    email: val,
                    check_textInputChange: false,
                    isValidUer: false
                })

            }
        }

        if (type == 'password') {
            if (val.trim().length >= 8) {
                setUserData({
                    ...userData,
                    password: val,
                    isValidPassword: true
                });
            } else {
                setUserData({
                    ...userData,
                    password: val,
                    isValidPassword: false
                });
            }
        }
    }
    
    function updateSecureTextEntry() {
        setUserData({
            ...userData,
            secureTextEntry: userData.secureTextEntry ? false : true
        })
    }
    // if(loginStatus.isLogin){
    //     navigation.navigate('Home')
    // }
    function forgetPassword(){
        navigation.navigate('ForgotPassword')
    }

    return (
        <>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios'? 'padding' : 'height'}
            style={{justifyContent: 'center', alignItems: 'center', backgroundColor: fBTheme.fBLigh, flex: 1}}>
            <View style={{ width: '80%', backgroundColor: '#fff', borderRadius: 15}}>
            <ScrollView>
                    <ImageBackground source={require('../assets/bgSquare.png')} style={{ height: 80, backgroundColor: fBTheme.fBPurple, borderTopLeftRadius: 15, borderTopRightRadius: 15, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                        <Image source={require('../assets/FBLogo.png')}/>
                    </ImageBackground>
                    <View style={styles.signInContainer}>
                        <View style={styles.action}>
                            <TextInput
                                placeholder="Enter email id/mobile no"
                                placeholderTextColor={fBTheme.fbGray}
                                style={styles.textInput}
                                autoCapitalize="none"
                                autoCorrect={false}
                                // value={data.email}
                                onChangeText={(val) => handleInputChange(val, 'email')}
                            />
                            <TouchableOpacity style={styles.userInput}>
                                {userData.check_textInputChange ?
                                    <View>
                                        <Feather
                                            name="check-circle"
                                            color={fBTheme.fBPurple}
                                            size={20}
                                        />
                                    </View>
                                    : null
                                }
                            </TouchableOpacity>
                            <TextInput
                                placeholder="Your Password"
                                placeholderTextColor={fBTheme.fbGray}
                                secureTextEntry={userData.secureTextEntry ? true : false}
                                style={styles.textInput}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(val) => handleInputChange(val, 'password')}
                            />
                            <TouchableOpacity
                                style={styles.passwordInput}
                                onPress={updateSecureTextEntry}
                            >
                                {userData.secureTextEntry?
                                    <Feather
                                        name="eye-off"
                                        color="grey"
                                        size={20}
                                    />:
                                    
                                    <Feather
                                        name="eye"
                                        color="grey"
                                        size={20}
                                    />
                                }
                           </TouchableOpacity>
                    </View>
                        <TouchableOpacity style={{paddingVertical:4}}
                        onPress={()=>forgetPassword()}
                        >
                            <Text style={{padding: 0, color:fBTheme.fBPurple, textAlign: 'left' }}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{width:'90%', backgroundColor: fBTheme.fBPurple, padding: 12, borderRadius: 6, alignSelf: 'center' }}
                    onPress={()=>{logIn(userData, navigation)}}
                    >{loginStatus.isLoading?
                        <ActivityIndicator size={25} color={fBTheme.fBLigh}/>:
                        <Text style={{ textAlign: 'center', color: '#fff' }}>LOGIN</Text>
                    }
                    </TouchableOpacity>
                    <View style={{flexDirection:'row',justifyContent:'center',width: '100%', paddingVertical:20}}>
                    <Text style={{color:fBTheme.fbGray, padding:4}}>Don't have account?</Text>
                    <TouchableOpacity style={{padding:4}}
                    onPress={()=>navigation.navigate('Account')}>
                        <Text style={{ color: fBTheme.fBPurple, fontWeight:'bold', textAlign: 'center' }}>Sign up!</Text>
                    </TouchableOpacity>

                    </View>

            </ScrollView>
                </View>
               


               
        </KeyboardAvoidingView>

        
        </>
    
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    signInContainer: {
        padding: 20
    },
    inputLable: {
        fontSize: 14
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 6,
        marginVertical: 10,
        padding:8,
        borderColor: fBTheme.fBPurple,
        color:'#000'
    },
    userInput: {
        position: 'absolute',
        right: 15,
        top: '18%',
        bottom: 0,
    },
    passwordInput: {
        position: 'absolute',
        justifyContent:'center',
        alignItems:'center',
        height:45,
        width:44,
        bottom: 10,
        right:0,
    },
    animationContainer:{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        position:'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0,
        justifyContent:'center',
        alignItems:'center'

    },
    animationStyle:{
        width:300,
        height:300,
        alignSelf:'center'
    }
})