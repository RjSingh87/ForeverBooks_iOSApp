import { SafeAreaView, StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import CustomInput from '../common/CustomInput'
import { fBTheme, token, apiRoot } from '../../constant'
import Iconicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import Services from '../../services'
import { MyData } from '../../Store'
import Loader from '../common/Loader'
import Lottie from 'lottie-react-native';
import { fetchAddressList } from '../reduxTookit/address/AddressListSlice'
import { useDispatch } from 'react-redux'
import CheckInternet from '../appScreen/CheckInternet'


const AddNewAddress = ({ navigation }) => {
    const { addUserData } = useContext(MyData)
    const [isLoader, setIsLoader] = useState(false)
    const [update, setUpdate] = useState(false)
    const [isVisiable, setisVisiable] = useState({
        alterNumber: false,
        landMark: false,
    })
    const [isModalVisible, setModalVisibility] = useState({ state: false, type: '' });
    const [isConnected, setIsConnected] = useState(false);
    const [userdetail, setUserDetail] = useState({
        fullname: '',
        phone_no: '',
        alternate_phone_no: '',
        list: [],
        type: '',
        selected: null,
        city: '',
        zip_code: '',
        address: '',
        landmark: ''
    })
    const [selectedItem, setSelectedItem] = useState({ country: null, state: null })
    const dispatch = useDispatch()

    function handleInputChange(val, type) {
        if (type == 'name') {
            setUserDetail((prev) => {
                return { ...prev, fullname: val }
            })
        }
        if (type == "phone") {
            setUserDetail((prev) => {
                return { ...prev, phone_no: val }
            })
        }
        if (type == "alternateNO") {
            setUserDetail((prev) => {
                return { ...prev, alternate_phone_no: val }
            })
        }

        if (type == "city") {
            setUserDetail((prev) => {
                return { ...prev, city: val }
            })
        }
        if (type == "zipCode") {
            setUserDetail((prev) => {
                return { ...prev, zip_code: val }
            })
        }
        if (type == "address") {
            setUserDetail((prev) => {
                return { ...prev, address: val }
            })
        }
        if (type == "landMark") {
            setUserDetail((prev) => {
                return { ...prev, landmark: val }
            })
        }
    }
    function openModal(type) {
        setIsLoader(true)
        if (type == 'country') {
            if (userdetail.fullname == '' || userdetail.phone_no == '') {
                Alert.alert('Info!', 'Select required fields.')
            } else {
                setModalVisibility((prev) => {
                    return { ...prev, state: true, type: type }
                })
                Services.post(apiRoot.getCountry, token)
                    .then((res) => {
                        if (res.status == 'success') {
                            const countryList = []
                            for (i = 0; i < res.data.length; i++) {
                                countryList.push({ name: res.data[i].countryNameLang1, id: res.data[i].country_id })
                            }

                            setUserDetail((prev) => {
                                return { ...prev, list: countryList, type: type, selected: selectedItem.country }
                            });
                            setIsLoader(false)
                        } else {
                            Alert.alert('Info!','data not found.')
                        }

                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {

                    })
            }
        }
        if (type == 'state') {
            setIsLoader(true)
            if (userdetail.fullname == '' || userdetail.phone_no == '' || selectedItem.country == null) {
                Alert.alert('Info!', 'Select required fields.')
            } else {
                setModalVisibility((prev) => {
                    return { ...prev, state: true, type: type }
                })
                const statePayload = {
                    "country_id": selectedItem.country.id,
                    "token": token
                }
                Services.post(apiRoot.getState, statePayload)
                    .then((res) => {
                        if (res.status == 'success') {
                            const stateList = []
                            for (i = 0; i < res.data.length; i++) {
                                stateList.push({ name: res.data[i].stateNameLang1, id: res.data[i].state_id })
                            }
                            setUserDetail((prev) => {
                                return { ...prev, list: stateList, type: type, selected: selectedItem.state }
                            });
                            setIsLoader(false)


                        } else {
                            Alert.alert('Info!','data not found.')
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {

                    })
            }
        }
    }
    function getData(type, item) {
        if (type == 'country') {
            setSelectedItem((prev) => {
                return { ...prev, country: item, state: null }
            });
            setModalVisibility((prev) => {
                return { ...prev, state: false }
            })
        }
        if (type == 'state') {
            setSelectedItem((prev) => {
                return { ...prev, state: item }
            });
            setModalVisibility((prev) => {
                return { ...prev, state: false }
            })
        }
    }

    function addAddress() {
        if (userdetail.fullname !== '' || userdetail.phone_no !== '' || userdetail.alternate_phone_no !== '' || userdetail.address !== '' || userdetail.zip_code !== '' || selectedItem?.country?.id !== null || selectedItem?.state?.id !== null || userdetail.city !== '' || userdetail.landmark !== '') {

            const submitPayload = {
                "customer_id": addUserData.customer_id,
                "fullname": userdetail.fullname,
                "phone_no": userdetail.phone_no,
                "alternate_phone_no": userdetail.alternate_phone_no,
                "address": userdetail.address,
                "zip_code": userdetail.zip_code,
                "country_id": selectedItem?.country?.id,
                "state_id": selectedItem?.state?.id,
                "city": userdetail.city,
                "landmark": userdetail.landmark,
                "token": token
            }
            Services.post(apiRoot.addNewAddress, submitPayload)
                .then((res) => {
                    if (res.status == 'success') {
                        setUpdate(true)
                        // alert(res.message)
                        setTimeout(() => {
                            navigation.goBack()
                            getSavedAddress()
                            setUpdate(false)
                        }, 1000)
                    } else {
                        Alert.alert('Info!',res.message)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    setUpdate(false)
                })
        } else {
            Alert.alert('Info!','Please select all required fields.')
        }
    }

    function getSavedAddress() {
        const getAddressPayload = {
            "customer_id": addUserData.customer_id,
            "token": token
        }
        dispatch(fetchAddressList(getAddressPayload))
    }

    function showAlternateField(type) {
        if (type == 'alternatePhone') {
            if (isVisiable.alterNumber) {
                setisVisiable((prev) => {
                    return { ...prev, alterNumber: false }
                })
            } else {
                setisVisiable((prev) => {
                    return { ...prev, alterNumber: true }
                })
            }
        }
        if (type == 'landmark') {
            if (isVisiable.landMark) {
                setisVisiable((prev) => {
                    return { ...prev, landMark: false }
                })
            } else {
                setisVisiable((prev) => {
                    return { ...prev, landMark: true }
                })
            }
        }

    }

    function closePopup() {
        setModalVisibility((prev) => {
            return { ...prev, state: false }
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {isConnected == true ? (
                <>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <ScrollView style={{ padding: 10 }}>
                            <CustomInput placeholder={'Enter full name (required)*'} value={userdetail.fullName} onChangeText={(val) => handleInputChange(val, 'name')} />
                            <CustomInput placeholder={'Enter mobile number (required)*'} value={userdetail.phone_no} keyboardType={'numeric'} maxLength={10} onChangeText={(val) => handleInputChange(val, 'phone')} />

                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}
                                onPress={() => { showAlternateField('alternatePhone') }}
                            >
                                <Iconicons name="add" size={20} color={fBTheme.fBPurple} />
                                <Text style={{ color: fBTheme.fBPurple }}>Add alternate phone number</Text>
                            </TouchableOpacity>

                            {isVisiable.alterNumber &&
                                <View style={{ flex: 1 }}>
                                    <CustomInput placeholder={'Alternate phone number'} value={userdetail.alternate_phone_no} keyboardType={'numeric'} maxLength={10} onChangeText={(val) => handleInputChange(val, 'alternateNO')} />
                                </View>
                            }
                            <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                                <TouchableOpacity style={{ flex: 1 }}
                                    onPress={() => openModal('country')}>
                                    <View style={styles.selectFieldBox}>
                                        <Text style={{ color: fBTheme.fbGray }}>{selectedItem.country == null ? 'Country (required)*' : selectedItem.country.name}</Text>
                                        <Feather name='chevron-down' size={20} />
                                    </View>
                                </TouchableOpacity>

                                <View style={{ flex: 1, marginLeft: 5 }}>
                                    <TouchableOpacity style={styles.selectFieldBox}
                                        onPress={() => openModal('state')}>
                                        <Text style={{ color: fBTheme.fbGray, fontWeight: '300' }}>{selectedItem.state == null ? 'State (required)*' : selectedItem.state.name}</Text>
                                        <Feather name='chevron-down' size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, }}>
                                    <CustomInput placeholder={'City (required)*'} value={userdetail.city} onChangeText={(val) => handleInputChange(val, 'city')} />
                                </View>

                                <View style={{ flex: 1, marginLeft: 5 }}>
                                    <CustomInput placeholder={'Post Code (required)*'} value={userdetail.zipCode} keyboardType={'numeric'} maxLength={6} onChangeText={(val) => handleInputChange(val, 'zipCode')} />
                                </View>
                            </View>

                            <CustomInput placeholder={'House No., Building Name (required)*'} value={userdetail.address} onChangeText={(val) => handleInputChange(val, 'address')} />
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}
                                onPress={() => { showAlternateField('landmark') }}
                            >
                                <Iconicons name="add" size={20} color={fBTheme.fBPurple} />
                                <Text style={{ color: fBTheme.fBPurple }}>Add Nearby Famous Shop/Mall/Landmark</Text>
                            </TouchableOpacity>
                            {isVisiable.landMark &&
                                <View style={{ flex: 1 }}>
                                    <CustomInput placeholder={'Enter Landmrk'} value={userdetail.landMark} onChangeText={(val) => handleInputChange(val, 'landMark')} />
                                </View>
                            }
                            {isModalVisible.state &&
                                <SelectField closePopup={closePopup} userdetail={userdetail} getData={getData} isLoader={isLoader} isModalVisible={isModalVisible} />
                            }
                            <TouchableOpacity style={styles.commandButton} onPress={() => { addAddress(userdetail) }}>
                                <Text style={styles.panelButtonTitle}>Submit</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    {update &&
                        <>
                            <View style={styles.animationContainer}>
                                <Lottie source={require('../../assets/myAnimation.json')}
                                    autoPlay loop
                                    style={styles.animationStyle} />
                                {/* <Text style={{fontSize:18, fontWeight:700, color:'green'}}>Update Successfully</Text> */}
                            </View>
                        </>
                    }
                </>
            ) : null}
            <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
        </SafeAreaView>
    )
};

function SelectField({ closePopup, userdetail, getData, isLoader, isModalVisible }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
        >
            {isLoader ?
                <Loader /> :
                <View style={styles.garyContainer}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => closePopup()}
                    />
                    <View style={styles.listBox}>
                        <View style={{ backgroundColor: fBTheme.fbGray, width: 35, height: 6, borderRadius: 4, alignSelf: 'center', marginVertical: 6 }}></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6, paddingVertical: 10, borderBottomWidth: .5, }}>
                            <TouchableOpacity style={{ width: 50 }}
                                onPress={() => closePopup()}
                            >
                                <Text style={{ color: fBTheme.fBRed }}>Close</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ alignSelf: 'center', textTransform: 'capitalize', fontWeight: 'bold' }}>{isModalVisible.type} List</Text>
                            </View>
                            <View style={{ width: 50 }}>
                            </View>

                        </View>
                        <ScrollView>
                            {userdetail.list.map((item, index) => {
                                let clsName = 'radio-button-off'
                                if (userdetail.selected?.id == item.id) {
                                    clsName = 'radio-button-on'
                                }
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => { getData(userdetail.type, item) }}
                                        style={styles.selectItemContainer}>
                                        <View style={styles.radioBox}>
                                            <Iconicons name={clsName} color={fBTheme.fBPurple} size={20} />
                                        </View>
                                        <Text style={{ color: fBTheme.fbGray }}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            })
                            }
                        </ScrollView>
                    </View>


                </View>
            }

        </Modal>
    )
}
export default AddNewAddress
const styles = StyleSheet.create({
    commandButton: {
        padding: 12,
        borderRadius: 6,
        backgroundColor: fBTheme.fBPurple,
        alignItems: 'center',
        marginTop: 10,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: '400',
        color: 'white',
    },
    selectFieldBox: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 45,
        overflow: 'hidden',
        borderWidth: .7,
        borderRadius: 4,
        paddingHorizontal: 6,
        borderColor: fBTheme.fBPurple,
        alignSelf: 'center',
    },
    garyContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    listBox: {
        backgroundColor: '#fff',
        maxHeight: '50%',
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    selectItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        borderBottomWidth: 1,
        borderColor: "#DADADB",
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderRadius: 4
    },
    radioBox: {
        paddingHorizontal: 10,

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
        width: 150,
        height: 150,
        alignSelf: 'center'
    }
})