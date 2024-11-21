import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { apiRoot, fBTheme, token } from '../../constant'
import { MyData } from '../../Store'
import CustomInput from '../common/CustomInput'
import Modal from "react-native-modal";
import services from '../../services';
import Loader from '../common/Loader';
import Lottie from 'lottie-react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';





const CreateNewAccount = ({ navigation }) => {
    const {createAccount, setErrorStatus, regUser } = useContext(MyData);
    const [isModalVisible, setModalVisible] = useState(false);
    const [errorMsg, setErrorMsg] = useState({status: false, msg: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [varifyData, setVarifyData] = useState({mobileOtp: null, emailOtp: null, msg: ""});
    const [otp, setOtp] = useState({phoneOtp: null, emailOtp: null});
    const [userDetails, setUserDetails] = useState({
        firstname: '',
        lastname: '',
        contact_no: '',
        email: '',
        password: '',
    });

    function userVarification(type){
        setOtp((prev) =>{
            return {...prev, phoneOtp: null, emailOtp: null}
        });
        setIsLoading(true)
        const varifyPayload = {
            "firstName": userDetails.firstname,
            "lastName": userDetails.lastname,
            "contactNo": userDetails.contact_no,
            "email": userDetails.email,
            "password": userDetails.password,
            "token": token
        }
        services.post(apiRoot.mobileAndEmailVarify, varifyPayload)
            .then((res) => {
                if (res.status == "success"){
                    setIsLoading(false)
                    setVarifyData((prev) =>{
                        return {...prev, mobileOtp: res.data.mobileOtp, emailOtp: res.data.emailOtp, msg: res.message}
                    })
                    if (type == "continue"){
                        setModalVisible(true)
                    }
                } else{
                    setErrorMsg((prev) => {
                        return {...prev, status: true, msg: res.message}
                    })
                    setTimeout(() =>{
                        setErrorMsg((prev) => {
                            return { ...prev, status: false}
                        })
                    }, 2500)
                }
            })
            .catch((err) => {
                console.log(err, 'otp')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    function handleInputChange(val, type){
        if (type == 'firstname') {
            setErrorStatus(true)
            setUserDetails((prev) => {
                return { ...prev, firstname: val}
            })
        } else if (type == 'lastname') {
            setErrorStatus(true)
            setUserDetails((prev) => {
                return { ...prev, lastname: val}
            })
        } else if (type == 'contact_no') {
            setErrorStatus(true)
            setUserDetails((prev) => {
                return { ...prev, contact_no: val}
            })
        } else if (type == 'email') {
            setErrorStatus(true)
            setUserDetails((prev) => {
                return { ...prev, email: val }
            })
        } else if (type == 'password') {
            setErrorStatus(true)
            setUserDetails((prev) => {
                return { ...prev, password: val }
            })
        } else {
            setErrorStatus(false)
        }
        if (type == "phoneOtp") {
            setOtp((prev) => {
                return { ...prev, phoneOtp: val}
            })
        }
        if (type == "emailOtp") {
            setOtp((prev) => {
                return { ...prev, emailOtp: val }
            })
        }
    }
    // Registered successfully.
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1, padding: 10}}>
            <ScrollView>
                <View>
                    <View style={{width: '100%', backgroundColor: fBTheme.fBWhite, padding: 15}}>
                        <CustomInput lable={'First Name'} placeholder={"Enter your first name"} onChangeText={(val) => handleInputChange(val, 'firstname')} value={userDetails.firstname} />
                        <CustomInput lable={'Last Name'} placeholder={"Enter your last name"} onChangeText={(val) => handleInputChange(val, 'lastname')} value={userDetails.lastname} />
                        <CustomInput lable={'Mobile Number'} placeholder={"Enter your mobile number"} keyboardType={"number-pad"} onChangeText={(val) => handleInputChange(val, 'contact_no')} maxLength={10} value={userDetails.contact_no}/>
                        <CustomInput lable={'E-mail Address'} placeholder={"Enter e-mail address"} onChangeText={(val) => handleInputChange(val, 'email')} value={userDetails.email} />
                        <CustomInput lable={'Password'} placeholder={"Enter password"} type={'password'} onChangeText={(val) => handleInputChange(val, 'password')} value={userDetails.password} />
                        <TouchableOpacity style={styles.contBtn}
                            onPress={() => {
                              userVarification("continue")
                            }}>
                            <Text style={{textAlign: 'center', color: fBTheme.fBWhite, fontWeight: 'bold'}}>Continue</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center'}}>
                            <Text style={{color:fBTheme.fbGray}}>Already have an account?</Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Login')}
                                style={{ padding: 8}}
                            >
                               <Text style={{ color: fBTheme.fBPurple }}>Sign-in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* //------------- mob & e-mail varification -------------------// */}

            {isLoading?
                <Loader/>:
                <Modal isVisible={isModalVisible}
                    animationInTiming={600}
                    animationOutTiming={600}
                    style={{width: '90%', margin: 0, alignSelf: 'center'}}
                >
                    <TouchableOpacity style={{ flex: 1, }} onPress={toggleModal}/>
                    <View style={{ backgroundColor: '#ffff', borderRadius: 10 }}>
                        <View style={{ backgroundColor: fBTheme.fBGreen, padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                            <Text style={{ textAlign: 'center', color: '#fff' }}>{varifyData.msg}</Text>
                        </View>
                        <View style={{ padding: 15 }}>
                            <View style={{ marginBottom: 15 }}>
                                <Text style={{ fontSize: 18, alignSelf: 'center', fontWeight: '500' }}>Verification</Text>
                            </View>
                            <View style={{}}>
                                <Text style={{color:fBTheme.fbGray}}>Enter OTP sent to +91{userDetails?.contact_no}</Text>
                                <View style={{ marginTop: 15 }}>
                                    <CustomInput onChangeText={(val) => handleInputChange(val, "phoneOtp")} value={otp.phoneOtp} keyboardType={"number-pad"} maxLength={6} />
                                </View>
                            </View>
                            <Text style={{textAlign:'center', fontSize:16, fontWeight:'bold', marginBottom:15, color:fBTheme.fbGray}}>OR</Text>
                            <View style={{}}>
                                <Text style={{color:fBTheme.fbGray}}>Enter OTP sent to {userDetails?.email}</Text>

                                <View style={{marginTop: 15}}>
                                    <CustomInput onChangeText={(val) => handleInputChange(val, "emailOtp")} value={otp.emailOtp} keyboardType={"number-pad"} maxLength={6}/>
                                </View>

                            </View>

                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, flexDirection: 'row', padding: 10, justifyContent: 'space-evenly'}}>
                                <TouchableOpacity
                                    style={{ width: '40%', padding: 10, borderRadius: 6, backgroundColor: fBTheme.fBPurple, marginBottom: 10 }}
                                    onPress={() => {
                                        if (parseInt(otp.phoneOtp) == parseInt(varifyData.mobileOtp) || parseInt(otp.emailOtp) == parseInt(varifyData.emailOtp)) {
                                            toggleModal()
                                            createAccount(userDetails, navigation);
                                            setIsLoading(true)
                                        } else if (parseInt(otp.phoneOtp) != parseInt(varifyData.mobileOtp)){
                                            Alert.alert("Info!","Please enter valid otp sent on your mobile.")
                                        } else if (parseInt(otp.emailOtp) != parseInt(varifyData.emailOtp)){
                                            Alert.alert("Info","Please enter valid otp sent on your email.")
                                        }
                                    }
                                    }>

                                    {!regUser.isLoding ?
                                        <Text style={{textAlign: 'center', color: fBTheme.fBWhite}}>Verify</Text>:
                                        <ActivityIndicator size={25} color={fBTheme.fBLigh} />
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ width: '40%', padding: 10, borderRadius: 6, backgroundColor: fBTheme.fBPurple, marginBottom: 10 }}
                                    onPress={() => {
                                        userVarification("resend")
                                    }}>
                                    <Text style={{ textAlign: 'center', color: fBTheme.fBWhite }}>Resend</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={{ flex: 1 }} onPress={toggleModal} />
                </Modal>
            }
            <Modal isVisible={errorMsg.status}
                animationInTiming={600}
                animationOutTiming={1000}
                style={{width: '100%', margin: 0, padding:15}}
            >
                <TouchableOpacity style={{flex: 1}}/>
                <View style={{flexDirection:'row'}}>
                    <View style={{width:60, height:60, backgroundColor:fBTheme.fBWhite, justifyContent:'center', alignItems:'center', borderTopLeftRadius:6, borderBottomLeftRadius:6}}>
                     <AntDesign name = 'closecircleo' size={30} color={fBTheme.fBRed}/>
                   </View>
                    <View style={{flex:1.5, justifyContent:'center', backgroundColor:fBTheme.fBWhite, padding:10, borderTopRightRadius:6, borderBottomRightRadius:6}}>
                        <Text>{errorMsg.msg}</Text>
                    </View>
                </View>
                <TouchableOpacity style={{flex:.3}}/>
            </Modal>
        </KeyboardAvoidingView>
    )
};




export default CreateNewAccount

const styles = StyleSheet.create({
    textInput: {
        width: '100%', borderWidth: 1, borderColor: fBTheme.fBPurple, borderRadius: 6
    },
    contBtn: {
        width: '100%', backgroundColor: fBTheme.fBPurple, borderRadius: 6, padding: 15
    },
    varifyBtn: {
        position: 'absolute'
    },
    animationContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'

    },
    animationStyle: {
        width: 100,
        height: 100,
        alignSelf: 'center'
    }





})