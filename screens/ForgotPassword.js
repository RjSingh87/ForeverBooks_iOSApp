import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { apiRoot, fBTheme, token } from '../constant';
// import Img1 from '../assets/forgetPassword.png';
import CustomInput from './common/CustomInput';
import services from '../services';
import ModalMsg from "react-native-modal";
import * as Animatable from 'react-native-animatable';

const ForgetPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isModalVisible, setModalVisible] = useState({status: false, msg: ''});

  function handleInputChange(val) {
    setEmail(val)
  }
  function getOtp() {
    const getOtpPayload = {
      "token": token,
      "email": email
    }
    services.post(apiRoot.forgetPasswordOtp, getOtpPayload)
      .then((res) => {
        console.log(res)
        if (res.status == "success") {
          setModalVisible((prev) => {
            return {...prev, status: true, msg: res.message}
          })
          setTimeout(()=>{
            navigation.navigate('VarifyYourMail',{emailId:email})
          },800)
        } else {
          setModalVisible((prev) => {
            return {...prev, status: true, msg: res.message}
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setTimeout(() => {
          setModalVisible((prev) => {
            return { ...prev, status: false}
          })
        },800)
      })
  }
  const toggleModal = ()=>{
    setModalVisible(!isModalVisible.status);
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: fBTheme.fBWhite, justifyContent:'center', alignItems: 'center', paddingHorizontal:30}}>
        {/*<Image source = {Img1} style={{ width: 130, height: 130 }} /> */}
        <Animatable.Image
                animation="zoomInUp"
                delay={600}
                source={require('../assets/forgetPassword.png')}
                style={{
                    width: 130,
                    height: 130,
                    resizeMode: 'contain',
                }}
        />
        <Text style={{ fontWeight: 'bold', marginVertical: 30, fontSize: 16, textAlign: 'center', color: 'black' }}>Please enter your email address to recieve One Time Password (OTP).</Text>
        <CustomInput lable={'Email Address'} placeholder={"Enter your email"} onChangeText={(val) => handleInputChange(val)} value={email} />
        <TouchableOpacity style={{ backgroundColor: fBTheme.fBPurple, padding: 12, width: '100%', borderRadius: 6, marginTop: 20}}
          onPress={() => getOtp()}>
          <Text style={{ color: fBTheme.fBWhite, textAlign: 'center', fontWeight: 'bold' }}>Send</Text>
        </TouchableOpacity>
      </View>
      <ModalMsg isVisible={isModalVisible.status}
        animationInTiming={300}
        animationOutTiming={600}
        style={{ width: '100%', margin: 0 }}
      >
        <TouchableOpacity style={{ flex: 1, }} onPress={toggleModal} />
        <View style={{ width: '90%', paddding: 10, borderRadius: 10, backgroundColor: '#fff', alignSelf: 'center' }}>
          <Text style={{ padding: 10, color: 'black', textAlign: 'center' }}>{isModalVisible.msg}</Text>
        </View>
        <TouchableOpacity style={{ flex: 0.15, }} onPress={toggleModal} />
      </ModalMsg>
    </>
  )
}

export default ForgetPassword

const styles = StyleSheet.create({})