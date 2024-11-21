import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, RefreshControl } from 'react-native'
import React, { useState, useContext, useEffect, useCallback } from 'react'
import { fBTheme, token, apiRoot } from '../../constant'
import Iconicons from 'react-native-vector-icons/Ionicons'

import AntDesign from 'react-native-vector-icons/AntDesign'
import { MyData } from '../../Store'
import Services from '../../services'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAddressList } from '../reduxTookit/address/AddressListSlice'
import CheckInternet from '../appScreen/CheckInternet';
import EmptyView from '../common/EmptyView'


const AddAddress = ({navigation}) => {
  const {addUserData} = useContext(MyData)
  const [isLoader, setIsLoader] = useState(false)
  const dispatch = useDispatch()
  const userAddressList = useSelector(state => state.userAddressList);
  const [isConnected, setIsConnected] = useState(false)


  useEffect(() => {
    const goBack = navigation.addListener('focus', () => {
      getSavedAddress()
    });
    return goBack
  }, [navigation])

  function getSavedAddress() {
    const getAddressPayload = {
      "customer_id": addUserData.customer_id,
      "token": token
    }
    dispatch(fetchAddressList(getAddressPayload))
    setIsLoader(false);

  }

  const showConfirmDialog = (id) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove this address?",
      [
        {
          text: "Remove",
          onPress: () => {
            deleteAddress(id);
          },
        },
        {
          text: "Cancel",
        },
      ]
    );
  }

  function deleteAddress(id) {
    const removeAddress = {
      "address_id": id,
      "token": token
    }

    Services.post(apiRoot.removeAddress, removeAddress)
      .then((res) => {
        if (res.status == 'success') {
          getSavedAddress()
        } else {
          Alert.alert('Info!','Failed')
        }
        if (!res.data.length){
          Alert.alert('Info!','Data not found.')
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      })
  }

  function editAddress(value) {
    navigation.navigate('EditAddress', {value})
  }

  // const onRefresh = useCallback(() => {
  //   setIsLoader(true);
  //   getSavedAddress();
  // }, []);

  return (
    <SafeAreaView style={{flex:1}}>
      {isConnected == true ? (
        <>

          <TouchableOpacity style={{ padding: 15, backgroundColor: fBTheme.fBWhite, elevation: 5, flexDirection: 'row', alignItems: 'center'}}
            onPress={() => navigation.navigate('AddNewAddress')}>
            <Iconicons name="add" size={25} color={fBTheme.fBPurple}/>
            <Text style={{ color: fBTheme.fBPurple, fontWeight: '500' }}>Add a new address</Text>
          </TouchableOpacity>

          <View style={{ flex:1, padding: 10, backgroundColor:fBTheme.fBLigh}}>
            <ScrollView style={{marginBottom: 48}}
              contentContainerStyle={{flexGrow: 1, justifyContent: userAddressList.data.length > 0 ? null : 'center'}}

              refreshControl = {
                <RefreshControl
                  refreshing={isLoader}
                  onRefresh={()=>{
                    setIsLoader(true);
                    getSavedAddress();
                  }}
                  tintColor={fBTheme.fBPurple}
                  title='Refresh'
                />}
            >
              {userAddressList.data.length>0?
                <View>
                  {userAddressList.data?.map((item, index) => {
                    const combinAddress = item.address + ', ' + item.city_name + ', ' + item.state_name + '-' + item.zip_code + ' ' + (item.landmark ? item.landmark : '')

                    return(
                      <View style={{ flexDirection: 'row', backgroundColor: fBTheme.fBWhite, borderRadius: 10, elevation: 2, marginVertical: 10}} key={item.address_id}>
                        {/* <View style={{padding:15}}>
                          <Ionicons name="radio-button-off" size={20} color={fBTheme.fBPurple}/>
                        </View> */}
                        <View style={{flex:1, padding: 10}}>
                          <Text style={{fontWeight: '500', color: 'black', marginBottom:4}}>{item.fullname}</Text>
                          <Text style={{marginVertical:6, color:fBTheme.fbGray}}>{combinAddress}</Text>
                          <Text style={{color: 'black', fontWeight:'500', marginBottom: 4}}>{item.phone_no}{item.alternate_phone_no?",":null} {item.alternate_phone_no? item.alternate_phone_no : ''}</Text>
                        </View>
                        <View style={{width: 50, alignItems: 'center', padding: 10, justifyContent:'space-around'}}>
                          <TouchableOpacity
                            onPress={() => showConfirmDialog(item.address_id)} style={{backgroundColor: fBTheme.fBRed, borderRadius: 50, padding: 4, marginVertical:2}}>
                            <AntDesign name='delete' size={14} color={fBTheme.fBWhite} style={{padding: 4,}}/>
                          </TouchableOpacity>
                          <TouchableOpacity style={{backgroundColor: fBTheme.fBPurple, borderRadius: 50, padding: 4, marginVertical:2}}
                            onPress={() => editAddress(item)}>
                            <AntDesign name='edit' size={14} color={fBTheme.fBWhite} style={{padding: 4}}/>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  })}
                </View>
                :
                <EmptyView mainMsg={"No address saved."} iconName={"address"} />
              }

            </ScrollView>
          </View>
        </>
      ) : null}
      <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
    </SafeAreaView>
  )
}
export default AddAddress
const styles = StyleSheet.create({})