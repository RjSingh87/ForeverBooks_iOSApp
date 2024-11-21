import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput} from 'react-native'
import React, { useRef, useState } from 'react';

import * as Animatable from 'react-native-animatable';
import ModalMsg from "react-native-modal";
import { apiRoot, fBTheme, token } from '../constant';
import services from '../services';


const VerifyYourMail = ({navigation, route}) => {
const emailID = route.params?.emailId
  const textInput1 = useRef();
  const textInput2 = useRef();
  const textInput3 = useRef();
  const textInput4 = useRef();
  const textInput5 = useRef();
  const textInput6 = useRef();

  const [inputText, setInputText]=useState({text1:'', text2:'', text3:'', text4:'', text5:'', text6:''})
  const[isModalVisible, setModalVisible] = useState({ status: false, msg:''});


  

  function verifyOTP() {
    const enteredOTP = Number(inputText.text1+inputText.text2+inputText.text3+inputText.text4+inputText.text5+inputText.text6)
    const matchOtpPayload = {
      "token" : token,
      "email" : emailID,
      "otp" : enteredOTP
 
    }
    services.post(apiRoot.matchEmailOtp, matchOtpPayload)
      .then((res) => {
        console.log(res)
        if(res.status=='success'){
          setModalVisible((prev)=>{
            return{...prev, status:true, msg:res.message}
          })
          setTimeout(()=>{
            navigation.navigate('ResetPassword',{emailID:emailID})
          },1000)

        }else{
          setModalVisible((prev) => {
            return { ...prev, status: true, msg: res.message }
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      })
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible.status);
  };
  return (
    <View style={{ flex: 1, backgroundColor: fBTheme.fBWhite, justifyContent: 'center', alignItems: 'center', paddingHorizontal:30 }}>
        {/* <Image source={Img1} style={{ width: 130, height: 130 }} /> */}
        <Animatable.Image
                            animation="zoomInUp"
                            delay={600}
                            source={require('../assets/otp.png')}
                            style={{
                                width: 130,
                                height: 130,
                                resizeMode: 'contain',
                            }}
          />
        <Text style={{ fontWeight: 'bold', marginVertical: 30, fontSize: 16, textAlign: 'center', color: 'black' }}>Please enter the 6 digit OTP sent on {emailID}</Text>
        <View style={{width:280, flexDirection:'row', justifyContent:'space-around'}}>
          <TextInput ref={textInput1}
          style={[styles.inputView,{borderColor:inputText.text1.length>=1?fBTheme.fBPurple:'gray'}]}
          keyboardType='number-pad'maxLength={1}
          value={inputText.text1}
          onChangeText={text=>{
            setInputText((prev)=>{
              return{...prev, text1:text}
            })
            if(text.length>=1){
              textInput2.current.focus();
            }
          }}/>
          <TextInput ref={textInput2}
          style={[styles.inputView,{borderColor:inputText.text2.length>=1?fBTheme.fBPurple:'gray'}]}
          keyboardType='number-pad'maxLength={1}
          value={inputText.text2}
          onChangeText={text=>{
            setInputText((prev)=>{
              return{...prev, text2:text}
            })
            if(text.length>=1){
              textInput3.current.focus();
            }else if(text.length<1){
              textInput1.current.focus()
            }
          }}/>
          <TextInput ref={textInput3}
          style={[styles.inputView,{borderColor:inputText.text3.length>=1?fBTheme.fBPurple:'gray'}]}
          keyboardType='number-pad'maxLength={1}
          value={inputText.text3}
          onChangeText={text=>{
            setInputText((prev)=>{
              return{...prev, text3:text}
            })
            if(text.length>=1){
              textInput4.current.focus();
            }else if(text.length<1){
              textInput2.current.focus()
            }
          }}/>
          <TextInput ref={textInput4}
          style={[styles.inputView,{borderColor:inputText.text4.length>=1?fBTheme.fBPurple:'gray'}]}
          keyboardType='number-pad'maxLength={1}
          value={inputText.text4}
          onChangeText={text=>{
            setInputText((prev)=>{
              return{...prev, text4:text}
            })
            if(text.length>=1){
              textInput5.current.focus();
            }else if(text.length<1){
              textInput3.current.focus()
            }
          }}/>
          <TextInput ref={textInput5}
          style={[styles.inputView,{borderColor:inputText.text5.length>=1?fBTheme.fBPurple:'gray'}]}
          keyboardType='number-pad'maxLength={1}
          value={inputText.text5}
          onChangeText={text=>{
            setInputText((prev)=>{
              return{...prev, text5:text}
            })
            if(text.length>=1){
              textInput6.current.focus();
            }else if(text.length<1){
              textInput4.current.focus()
            }
          }}/>
          <TextInput ref={textInput6}
          style={[styles.inputView,{borderColor:inputText.text6.length>=1?fBTheme.fBPurple:'gray'}]}
          keyboardType='number-pad'maxLength={1}
          value={inputText.text6}
          onChangeText={text=>{
            setInputText((prev)=>{
              return{...prev, text6:text}
            })
            if(text.length>=1){
              textInput6.current.focus();
            }else if(text.length<1){
              textInput5.current.focus()
            }
          }}/>

        </View>

        {/* <CustomInput lable={'Emter'} placeholder={"Enter your email"} onChangeText={(val) => handleInputChange(val)} value={email} /> */}
        <TouchableOpacity
        disabled={inputText.text1!=''&&inputText.text2!=''&&inputText.text3!=''&&inputText.text4!=''&&inputText.text5!=''&&inputText.text6!=''?false:true}
        style={{ backgroundColor: inputText.text1!=''&&inputText.text2!=''&&inputText.text3!=''&&inputText.text4!=''&&inputText.text5!=''&&inputText.text6!=''?fBTheme.fBPurple:'gray', padding: 12, width: '100%', borderRadius: 6, marginTop: 20 }}
          onPress={() => verifyOTP()}
          >
          <Text style={{ color: fBTheme.fBWhite, textAlign: 'center', fontWeight: 'bold' }}>Verify OTP</Text>
        </TouchableOpacity>

        <ModalMsg isVisible={isModalVisible.status}
        animationInTiming={300}
        animationOutTiming={600}
        style={{ width: '100%', margin: 0 }}
      >
        <TouchableOpacity style={{ flex: 1, }} onPress={toggleModal} />
        <View style={{ width: '90%', paddding: 10, borderRadius: 10, backgroundColor: '#fff', alignSelf: 'center' }}>
          <Text style={{ padding: 10, color: 'black', textAlign: 'center'}}>{isModalVisible.msg}</Text>
        </View>
        <TouchableOpacity style={{ flex: 0.15, }} onPress={toggleModal}/>
      </ModalMsg>


      </View>
  )
}

export default VerifyYourMail

const styles = StyleSheet.create({
  inputView:{
    width:42, height:42, borderWidth:1, borderRadius:4, fontSize:20, fontWeight:'700', textAlign:'center'
  }
})