import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import { apiRoot, fBTheme, token } from '../constant';
import CustomInput from './common/CustomInput';
import services from '../services';
import ModalMsg from "react-native-modal";
import * as Animatable from 'react-native-animatable';



const ResetPassword = ({navigation, route}) => {
   
  const[password, setPassword] = useState({new:'', confirm:''})
  const[isModalVisible, setModalVisible] = useState({ status: false, msg:''});
  const screenName = 'ResetPassword'


  function handleInputChange(val, type){
    if(type=="newPassword"){
      setPassword((prev)=>{
        return{...prev, new:val}
      })
    }
    if(type=="confirmPassword"){
      setPassword((prev)=>{
        return{...prev, confirm:val}
      })
    }
  }
  function updatePassword(){
    const updatePayload = {
      "token" : token,
      "email" : route.params?.emailID,
      "password" : password.new,
      "confirmPassword" : password.confirm
     }
     services.post(apiRoot.updatePassword, updatePayload)
     .then((res)=>{
      if(res.status=='success'){
        setModalVisible((prev) => {
          return {...prev, status: true, msg: res.message}
        })
        setTimeout(()=>{
          navigation.navigate('Login',{screen:screenName})
        },2000)
      }else {
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
          return { ...prev, status: false, }
        })
      },2000)
    })

  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible.status);
  };

  return (
    <View style={{ flex: 1, backgroundColor: fBTheme.fBWhite, justifyContent: 'center', alignItems: 'center', paddingHorizontal:30}}>
        {/* <Image source={Img1} style={{ width: 130, height: 130 }} /> */}
        <Animatable.Image
                  animation="zoomInUp"
                  delay={600}
                  source={require('../assets/updatepassword.png')}
                  style={{
                      width: 130,
                      height: 130,
                      resizeMode: 'contain',
                  }}
          />
        <Text style={{ fontWeight: 'bold', marginVertical: 30, fontSize: 16, textAlign: 'center', color: 'black' }}>Enter your new pssword.</Text>
        <CustomInput lable={'New Password'} placeholder={"Enter your new password"} type={"password"} onChangeText={(val) => handleInputChange(val, 'newPassword')} value={password.new} />
        <CustomInput lable={'Confirm Password'} placeholder={"Confirm password"} type={"password"} onChangeText={(val) => handleInputChange(val, 'confirmPassword')} value={password.confirm} />
        <TouchableOpacity
        style={{ backgroundColor: fBTheme.fBPurple, padding: 12, width: '100%', borderRadius: 6, marginTop: 20}}
          onPress={() => updatePassword()}
          >
          <Text style={{ color: fBTheme.fBWhite, textAlign: 'center', fontWeight: 'bold' }}>Save</Text>
        </TouchableOpacity>

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


      </View>
  )
}

export default ResetPassword

const styles = StyleSheet.create({})