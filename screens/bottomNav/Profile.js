import { SafeAreaView, StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { fBTheme, mainURL, token } from '../../constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { MyData } from '../../Store';
import Loader from '../common/Loader';
import { fetchProfileData } from '../reduxTookit/address/ProfileSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddressList } from '../reduxTookit/address/AddressListSlice';
import CheckInternet from '../appScreen/CheckInternet';
import { addProfileData } from '../reduxTookit/address/ProfileSlice';
import EmptyView from '../common/EmptyView';

const Profile = ({ navigation }) => {

  const { logOut, addUserData } = useContext(MyData)
  const dispatch = useDispatch()

  const userprofileData = useSelector(state => state.profileData)
  const userAddressList = useSelector(state => state.userAddressList)
  const [isLoading, setLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const goBack = navigation.addListener('focus', () => {
      getCustomerProfileData();
      getSavedAddress();
    });
    return goBack
  }, [])

  const onRefresh = useCallback(() => {
    setLoading(true);
    getCustomerProfileData();
    getSavedAddress();
  }, []);

  function getCustomerProfileData() {
    const dataPayload = {
      "customer_id": addUserData.customer_id,
      "token": token
    }
    dispatch(fetchProfileData(dataPayload));
    setLoading(false);
  }

  function getSavedAddress() {
    const getAddressPayload = {
      "customer_id": addUserData.customer_id,
      "token": token
    }
    dispatch(fetchAddressList(getAddressPayload))
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: fBTheme.fBPurple }}>
      {isConnected == true ? (
        <>
          <ScrollView
            style={{ flex: 1, backgroundColor: fBTheme.fBWhite, }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={onRefresh}
                tintColor={fBTheme.fBPurple}
                title='Refresh'
              />
            }
          >
            {userprofileData.data == null ?
              <EmptyView mainMsg={'You have been logged out.'} addBtn={"logOut"} />
              :
              <>
                <View style={{ width: '100%', height: 118 }}>
                  <ImageBackground
                    source={require('../../assets/bgSquare.png')}
                    style={styles.img}>
                    <View style={styles.prfPicCircle}>
                      <Image source={{ uri: mainURL + userprofileData?.data?.profile_path + userprofileData?.data?.profile_image }} style={styles.profPicContainer}></Image>
                    </View>
                  </ImageBackground>
                </View>
                <View style={{ width: '90%', alignSelf: 'center', marginTop: 60, color: 'red' }}>
                  <Text style={{ textAlign: 'center', fontWeight: '500', color: '#000', textTransform: 'capitalize' }}>{userprofileData?.data?.firstname + ' ' + userprofileData?.data?.lastname}</Text>
                </View>
                <ScrollView>
                  <View style={{ width: '90%', alignSelf: 'center', marginTop: 50 }}>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: .5, marginBottom: 20 }}>
                      <Text style={{ fontWeight: '500', color: '#000', }}>Profile</Text>

                      <TouchableOpacity
                        onPress={() => { navigation.navigate('EditProfile', { userprofileData }) }}>
                        <FontAwesome name="edit" size={26} color={fBTheme.fBPurple} />
                      </TouchableOpacity>

                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <Ionicons name='call' size={18} color={fBTheme.fBPurple} style={{ width: 40 }} />
                      <Text style={{ color: fBTheme.fbGray }}>+91-{userprofileData?.data?.contact_no}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <Ionicons name='mail' size={18} color={fBTheme.fBPurple} style={{ width: 40 }} />
                      <Text style={{ color: fBTheme.fbGray }}>{userprofileData?.data?.email}</Text>
                    </View>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <MaterialCommunityIcons name='map-marker-radius' size={22} color={fBTheme.fBPurple} style={{ width: 40 }} />
                  <Text style={{ flex: 1, paddingRight: 15, color:fBTheme.fbGray }}>{userAddressList.data.length <= 0 ? 'Add Address' : `${userAddressList?.data[0]?.address} ${userAddressList?.data[0]?.state_name}- ${userAddressList?.data[0]?.zip_code}`
                    }</Text>
                </View> */}
                  </View>
                  <View style={{ width: '90%', alignSelf: 'center', marginTop: 15, borderTopWidth: 0.5, borderColor: fBTheme.fBPurple, paddingVertical: 15 }}>
                    <TouchableOpacity style={{ marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between' }}
                      onPress={() => { navigation.navigate('WishList') }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name='heart-outline' size={20} color={fBTheme.fBPurple} style={{ width: 40 }} />
                        <Text style={{ color: '#000' }}>Wish List</Text>
                      </View>
                      <View>
                        <MaterialIcons name='chevron-right' size={24} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between' }}
                      onPress={() => { navigation.navigate('MyOrders') }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Feather name='shopping-bag' size={18} color={fBTheme.fBPurple} style={{ width: 40 }} />
                        <Text style={{ color: '#000' }}>My Orders</Text>
                      </View>
                      <View>
                        <MaterialIcons name='chevron-right' size={24} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between' }}
                      onPress={() => { navigation.navigate('AddAddres', { addUserData }) }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name='map-marker-radius' size={20} color={fBTheme.fBPurple} style={{ width: 40 }} />
                        <Text style={{ color: '#000' }}>Saved Address</Text>
                      </View>
                      <View>
                        <MaterialIcons name='chevron-right' size={24} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={(() => { logOut() })}>
                      <View style={{ alignItems: 'center', backgroundColor: fBTheme.fBPurple, padding: 12, borderRadius: 6, marginVertical: 15 }}>
                        <Text style={{ color: fBTheme.fBWhite }}>Sign Out</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            }
          </ScrollView>

        </>
      ) : null}
      <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
    </SafeAreaView>

  )
}
export default Profile
const styles = StyleSheet.create({
  img: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: fBTheme.fBPurple
  },
  prfPicCircle: {
    height: 110,
    width: 110,
    borderRadius: 100,
    backgroundColor: fBTheme.fBWhite,
    borderColor: fBTheme.fBPurple,
    borderWidth: 1,
    padding: 8,
    position: 'absolute',
    bottom: -50,
    elevation: 0.9
  },
  profPicContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  cameraContainer: {
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: fBTheme.fBPurple,
    position: 'absolute',
    bottom: -12,
    left: '40%',
    right: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  }
})