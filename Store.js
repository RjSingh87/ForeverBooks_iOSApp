import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, ActivityIndicator, StyleSheet, Animated, Easing, TouchableOpacity, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Services from './services';
import { apiRoot, fBTheme, token } from './constant';
import Lottie from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';

export const MyData = React.createContext();
export default function Store({children}){
  const [loginStatus, setLoginStatus] = useState({
    isLogin: false,
    isLoading: false,
    msg: "",
    type: ""
  });

  const [regUser, setRegUser] = useState({
    isUser: false,
    isLoding:false,
    msg:'',
  })
  const [addUserData, setAddUserData] = useState({});
  const [errorStatus, setErrorStatus] = useState({
    status: false,
    msg: ''
  });

  const [showAnimation, setShowAnimation] = useState({status: false, type:''})
  const [uniqueID, setUniqueID] = useState()
  const [offerBanner, setOfferBanner] = useState()
  const animationProgress = useRef(new Animated.Value(0))

  useEffect(() => {
    // requestUserPermission()
    DeviceInfo.getAndroidId().then((androidId) => {
      setUniqueID(androidId)
    });
    
    Animated.timing(animationProgress.current,{
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false
    }).start();
    checkUserLogin()
    getBannerList()
  }, []);

  function getBannerList(){
    const bannerPayload = {
      "token":token,
      "deviceID":2
    }
    Services.post(apiRoot.banner_api, bannerPayload)
    .then((res)=>{
      if(res.status=="success"){
        setOfferBanner(res.data)
      }
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  async function checkUserLogin() {
    const LogUserData = await AsyncStorage.getItem('LogUserData')
    if (LogUserData != null){
      const LoginUserData = JSON.parse(LogUserData)
      setAddUserData(LoginUserData)
      setLoginStatus((prev) => {
        return { ...prev, isLogin: true}
      })
    }
  }
  async function createAccount(data, navigation){
    setRegUser((prev) => {
      return {...prev, isLoding: true}
    })
    Services.post(apiRoot.register, data)
      .then((res) => {
        if (res.status == 'success'){
          setRegUser((prev) => {
            return {...prev, isLoding: false, isUser:true, msg: res.message}
          })
          setShowAnimation((prev) =>{
            return {...prev, status: true, type: 'registor'}
          })
          setTimeout(() =>{
            setShowAnimation((prev) => {
              return {...prev, status: false, type: ''}
            })
          }, 4000)
          navigation.navigate('Login')
        } else {
          setRegUser((prev) => {
            return { ...prev, isLoding: false, msg: res.message}
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      })
  }
  function logIn(data, navigation){    
    const loginPayload = {      
      "password": data.password,
      "session_id": uniqueID,
      "token": token
    }
    const regex = /^\d+$/;
    const isContact = data.email.match(regex);
    if( isContact ) {
      loginPayload['contact_no'] = data.email;
    } else {
      loginPayload['email'] = data.email;
    }
    setLoginStatus((prev) => {
      return { ...prev, isLoading: true}
    })
    if (data.email == '' || data.password == ''){
      Alert.alert('Info!','Please enter required fields.')
      setLoginStatus((prev) =>{
        return {...prev, isLoading: false}
      })
    } else {
      Services.post(apiRoot.login, loginPayload)
        .then((res) => {
          
          if (res.status == 'success'){
            AsyncStorage
              .setItem('LogUserData', JSON.stringify(res.data))
              .then((res) => console.log('Done'))
              .catch((err) => { console.log(err)});
            setAddUserData(res.data);
            setLoginStatus((prev) => {
              return {...prev, isLogin: true, isLoading: false}
            });

            setShowAnimation((prev) => {
              return {...prev, status: true, type: 'login', message:res.message}
            })
            setTimeout(() => {
              setShowAnimation((prev) => {
                return { ...prev, status: false, type: '' }
              })
            }, 4000)
            if (data.screenName == "ResetPassword") {
              navigation.navigate('Dashboard')
            } else {
              navigation.goBack();
            }
          } else{
            setShowAnimation((prev) => {
              return {...prev, status: true, type: 'Retry', message:res.message}
            })
            setLoginStatus((prev) => {
              return {...prev, isLoading: false}
            })
          }
        })
        .catch((err) => {
          console.log(err)
          setLoginStatus((prev) => {
            return {...prev, isLoding: false, msg: err.message, type: "error"}
          });
        })
    }
  };
  function logOut() {
    AsyncStorage.removeItem('LogUserData')
    setAddUserData({})
    setLoginStatus((prev) => {
      return {...prev, isLogin: false}
    })
 }
  function closeAnimation(){
    setShowAnimation((prev) =>{
      return {...prev, status: false}
    })
  }

  return (
    <>
      <MyData.Provider value={{loginStatus, logOut, logIn, createAccount, errorStatus, setErrorStatus, addUserData, regUser, checkUserLogin, uniqueID, showAnimation, offerBanner}}>
        {children}
      </MyData.Provider>
      {showAnimation.status &&
        <View style={styles.animationContainer}>
          <View style={{width: '85%', height: 280, borderRadius: 10, backgroundColor: fBTheme.fBWhite}}>
          {showAnimation.type == "Retry" ?
            <Lottie source={require('./assets/notFound.json')}
              autoPlay loop
              style={[styles.animationStyle, {flex: 2}]}
            />:
            <Lottie source={require('./assets/myAnimation.json')}
              autoPlay loop
              style={[styles.animationStyle, {flex: 2}]}
            />
          }
            <View style={{ flex: 1, padding: 10, justifyContent: 'center', borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
              <Text style={{ fontSize: 16, color: fBTheme.fBPurple, textAlign: 'center'}}>{showAnimation.type == "registor" ? "Congratulation, your account has been successfully created." : showAnimation.message}</Text>

              <TouchableOpacity style={{padding: 10, width: '60%', backgroundColor: fBTheme.fBPurple, borderRadius: 6, alignSelf: 'center', marginVertical: 15}}
                onPress={() => {closeAnimation()}}>
                <Text style={{textAlign: 'center', color: fBTheme.fBWhite}}>{showAnimation.type=="Retry"?"Retry":"Continue"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    </>
  );
}
const styles = StyleSheet.create({
    animationContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position:'absolute',
    top: 0,
    bottom:0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  animationStyle: {
    width: 80,
    height: 80,
    alignSelf: 'center'
  }
})

