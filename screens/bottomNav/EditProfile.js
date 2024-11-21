import {SafeAreaView, StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView, Button } from 'react-native'
import React, {useContext, useState} from 'react'
import { fBTheme, token, apiRoot, mainURL } from '../../constant'

import Modal from "react-native-modal";
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomInput from '../common/CustomInput'
import ImagePicker from 'react-native-image-crop-picker';
import {MyData} from '../../Store';
import Services from '../../services';
import {useDispatch} from 'react-redux';
import {addProfileData, fetchProfileData} from '../reduxTookit/address/ProfileSlice';
import CheckInternet from '../appScreen/CheckInternet';
import SuccessAnimation from '../common/SuccessAnimation';


const EditProfile = ({navigation, route}) => {
    
const profileData = route.params.userprofileData.data
  const{addUserData} = useContext(MyData)
  const[image, setImage] = useState(mainURL+profileData.profile_path+profileData.profile_image)
  const[isModalVisible, setModalVisible] = useState(false);
  const[update, setUpdate] = useState(false)
  const[userDetail, setUserDetail] = useState({
    firstname:profileData.firstname,
    lastname:profileData.lastname,
    contact_no:profileData.contact_no,
    email:profileData.email,
  });
const [isConnected, setIsConnected] = useState(false)
const [isStatus, setIsStatus] = useState({ status: false, msg: '' });
const dispatch = useDispatch()
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const showStatusModal =()=>{
    setIsStatus((prev)=>{
      return{...prev, status:!isStatus}
    })
  }
  const takePhotoFromCamera=()=>{
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality:0.7
    }).then(image => {
      setImage(image.path)
      setModalVisible(false)
    })
    .catch((err)=>{
      console.log(err)
    });
  }
  const choosePhotoFromLibrary=()=>{
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality:0.7
    }).then(image => {
      setImage(image.path)
      setModalVisible(false)
    })
     .catch((err)=>{
      console.log(err)
    })
    .catch((err)=>{
      console.log(err)
    })
    ;
  }
  
  function handleInputChange(val, type) {
    if(type=='fName'){
      setUserDetail((prev)=>{return{...prev, firstname:val}})
    }
    if(type=='lName'){
      setUserDetail((prev)=>{return{...prev, lastname:val}})
    }
    // if(type=='mobile'){
    //   setUserDetail((prev)=>{return{...prev, contact_no:val}})
    // }
    // if(type=='email'){
    //   setUserDetail((prev)=>{return{...prev, email:val}})
    // }
    // if(type=='address'){
    //   setUserDetail((prev)=>{return{...prev, address:val}})
    // }
    // if(type=='pincode'){
    //   setUserDetail((prev)=>{return{...prev, pincode:val}})
    // }
    // if(type=='city'){
    //   setUserDetail((prev)=>{return{...prev, city:val}})
    // }
    // if(type=='state'){
    //   setUserDetail((prev)=>{return{...prev, state:val}})
    // }
    // if(type=='counrty'){
    //   setUserDetail((prev)=>{return{...prev, country:val}})
    // }

  }
  function updateAccount(){
    const formData = new FormData();
        formData.append("customer_id", addUserData.customer_id);
        formData.append("firstname", userDetail.firstname);
        formData.append("lastname", userDetail.lastname);
        formData.append("token", token);
        formData.append("profile_image", {
          uri:image,
          name:'image.png',
          fileName:'image',
          type:'image/png'
        });
  Services.formMethod(apiRoot.updateUserProfile, formData)
    .then((res) => {
        if (res.status == 'success'){
            setUpdate(true)
            dispatch(fetchProfileData(userDetail))
            setTimeout(()=>{
              navigation.goBack()
            },1000)
        } else{
            setIsStatus((prev)=>{
              return{...prev, status:true, msg:res.message}
            })
            setTimeout(()=>{
              setIsStatus((prev)=>{
                return{...prev, status:false}
              })
            },1000)
        }
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      setIsStatus((prev)=>{
        return{...prev, status:false}
      })
    })
  }
 
  return (
    <SafeAreaView style={{flex:1}}>
      {isConnected==true?(
        <View style={{ flex: 1, backgroundColor: fBTheme.fBWhite,}}>
        <View style={{ width: '100%', height: 118}}>
          <ImageBackground
            source={require('../../assets/bgSquare.png')}
            style={styles.img}
          >
            <View style={styles.prfPicCircle}>
              {/* <Image source={require($image)} style={styles.profPicContainer}></Image>*/}
              {image!==""&&
                <Image source={{uri:image}} style={styles.profPicContainer}></Image>
              }
                <TouchableOpacity style={styles.cameraContainer}onPress={toggleModal}>
                <Ionicons name='camera' size={20} color={fBTheme.fBPurple} />
              </TouchableOpacity>
                <Modal isVisible={isModalVisible}
                animationInTiming={300}
                animationOutTiming={900}
                style={{width:'100%', margin:0}}
                >
                  <TouchableOpacity style={{flex:1,}} onPress={toggleModal}/>
                <View style={{ height:'35%', backgroundColor:'#ffff',borderTopRightRadius:10, borderTopLeftRadius:10, padding:10 }}>
                  <View style={{marginBottom:15}}>
                    <Text style={{fontSize:18, alignSelf:'center', fontWeight:'500', color:'#000'}}>Upload Photo</Text>
                    <Text style={{alignSelf:'center', color:fBTheme.fbGray}}>Choose your profile picture</Text>
                  </View>
                  <View style={{justifyContent:'center', alignItems:'center'}}>
                    <TouchableOpacity
                        style={{width:'60%',padding:10, borderRadius:6, backgroundColor:fBTheme.fBPurple, marginBottom:10}}
                        onPress={takePhotoFromCamera}
                        >
                      <Text style={{textAlign:'center', color:fBTheme.fBWhite}}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{width:'60%',padding:10, borderRadius:6, backgroundColor:fBTheme.fBPurple, marginBottom:10}}
                        onPress={choosePhotoFromLibrary}
                        >
                      <Text style={{textAlign:'center', color:fBTheme.fBWhite}}>Choose From Library</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{width:'60%',padding:10, borderRadius:6, backgroundColor:fBTheme.fBPurple, marginBottom:10}}
                        onPress={toggleModal}>
                      <Text style={{textAlign:'center', color:fBTheme.fBWhite}}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </Modal>
              </View>
          </ImageBackground>
          
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding':'height'}
          style={{flex:1, backgroudColor:'red',padding:10, marginTop:60}}>
            <ScrollView style={{paddingHorizontal:10}}>
              <CustomInput placeholder={'Enter first name'} lable={"First Name"} defaultValue={userDetail.firstname} onChangeText={(val)=>handleInputChange(val,'fName')}/>
              <CustomInput placeholder={'Enter last name'} lable={"Last Name"} defaultValue={userDetail.lastname} onChangeText={(val)=>handleInputChange(val,'lName')}/>
              <CustomInput placeholder={'Enter mobile name'} lable={'Mobile Number'} value={userDetail.contact_no} editable="false" selectTextOnFocus="false"/>
              <CustomInput placeholder={'Enter e-mail address'} lable={'E-mail Address'} value={userDetail.email} editable="false" selectTextOnFocus="false"/>
              {/* <CustomInput placeholder={'Enter mobile name'} lable={'Mobile Number'} defaultValue={userDetail.contact_no} keyboardType={'number-pad'} onChangeText={(val)=>handleInputChange(val,'mobile')}/>
              <CustomInput placeholder={'Enter e-mail address'} lable={'E-mail Address'} defaultValue={userDetail.email} onChangeText={(val)=>handleInputChange(val,'email')}/> */}
              <TouchableOpacity style={styles.commandButton} onPress={() => {updateAccount()}}>
              <Text style={styles.panelButtonTitle}>Submit</Text>
          </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
  
        {update &&
              <>
              <SuccessAnimation/>
              </>
              }
  
      </View>

      ):null}
      <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected}/>

      <Modal isVisible={isStatus.status}
        animationInTiming={300}
        animationOutTiming={600}
        style={{width: '100%', margin: 0}}
      >
        <TouchableOpacity style={{ flex: 1, }} onPress={showStatusModal} />
        <View style={{ width: '90%', paddding: 10, borderRadius: 10, backgroundColor: '#fff', alignSelf: 'center' }}>
          <Text style={{ padding: 10, color: 'black', textAlign: 'center' }}>{isStatus.msg}</Text>
        </View>
        <TouchableOpacity style={{ flex: 0.15, }} onPress={showStatusModal} />
      </Modal>


    </SafeAreaView>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  img: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  prfPicCircle: {
    height: 110,
    width: 110,
    borderRadius: 60,
    backgroundColor: fBTheme.fBWhite,
    borderColor: fBTheme.fBPurple,
    borderWidth: 1,
    padding: 4,
    position: 'absolute',
    zIndex:9999,
    bottom: -50,
    elevation: 0.8,
    // overflow:'hidden'

  },
  profPicContainer: {
    width: '100%',
    height: '100%',
    borderRadius:100,
    
  },
  cameraContainer: {
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: fBTheme.fBLigh,
    position: 'absolute',
    bottom: 0,
    left: 50,
    transform: [{translateX: -16},{translateY: 16}],
    // right: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:1
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: fBTheme.fBPurple,
    alignItems: 'center',
    marginTop: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
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