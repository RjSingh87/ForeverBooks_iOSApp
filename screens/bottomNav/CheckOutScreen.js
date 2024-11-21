import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Iconicons from 'react-native-vector-icons/Ionicons'
import { apiRoot, fBTheme, token } from '../../constant'
import { useDispatch, useSelector } from 'react-redux'
import { MyData } from '../../Store'
import { fetchAddressList } from '../reduxTookit/address/AddressListSlice'
import Loader from '../common/Loader'
import ChackoutLayout from './ChackoutLayout'
import CheckInternet from '../appScreen/CheckInternet'
import services from '../../services'


const CheckOutScreen = ({ navigation, route }) => {

  const { addUserData, uniqueID } = useContext(MyData);
  const userAddressList = useSelector(state => state.userAddressList)
  const [addModal, setAddModal] = useState({status: false, selected: null})
  const [selectedAddress, setSelectedAddress] = useState({index:0, item:null})
  const [isConnected, setIsConnected] = useState(false)
  const [shippingCharge, setShippingCharge] = useState({charge:null, status:false})

  const dispatch = useDispatch()
  useEffect(() => {
    getSavedAddress()
  }, [selectedAddress]);

  useEffect(()=>{
    getShippingCharge()
  },[userAddressList])

  function getShippingCharge(){
    const payload = {
      "token"   : token,
      "address_id"  : userAddressList?.data[selectedAddress.index]?.address_id
  }
  services.post(apiRoot.getShippingCharge, payload)
  .then((res)=>{
    if(res.status=="success"){
      setShippingCharge((prev)=>{
        return{...prev, charge:res.shippingCharge, status:true}
      })
    }
  })
  .catch((err)=>{
    console.log(err)
  })
  .finally(()=>{

  })

  }

  function getSavedAddress() {
    const getAddressPayload = {
      "customer_id": addUserData?.customer_id,
      "token": token
    }
    dispatch(fetchAddressList(getAddressPayload))
  }

  function changeAddress() {
    setAddModal((prev) => {
      return { ...prev, status: true }
    });
    getSavedAddress()
  }

  function closePopup() {
    setAddModal((prev) => {
      return { ...prev, status: false }
    })
  }

  function selectAddress(item, index) {
    setSelectedAddress((prev)=>{
      return{...prev, index:index, item:item}
    })
    getShippingCharge()
    
    setAddModal((prev) => {
      return { ...prev, status: false }
    })
  }

  function AddNewAddress() {
    navigation.navigate('AddNewAddress')
  }

  return (
    <>
    {isConnected==true?(
      <>
      {userAddressList.loading ?
        <Loader /> :
        <View style={{ flex: 1, backgroundColor: fBTheme.fBLigh, padding: 10 }}>
          <View>
            {!userAddressList.data.length<=0?
            <View>
              <View style={{ flexDirection: 'row'}}>
                <View style={{ width: '50%'}}>
                  <Text style={{ fontWeight: '500', color:'#000'}}>Deliver to:</Text>
                </View>
                <View style={{ width: '50%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                  <TouchableOpacity style={{ borderWidth: 1, borderColor: fBTheme.fBPurple, backgroundColor: fBTheme.fBWhite, width: 100, padding: 4, borderRadius: 4, }}
                    onPress={() => changeAddress()}>
                    <Text style={{textAlign: 'center', fontWeight: '500', color: fBTheme.fBPurple}}> Change</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ padding: 10, backgroundColor: fBTheme.fBWhite, marginVertical: 6, borderRadius: 6 }}>
                <Text style={{ fontWeight: '500', color: 'black', marginVertical: 4 }}>{userAddressList?.data[selectedAddress.index]?.fullname}</Text>
                <Text style={{color:fBTheme.fbGray}}>{userAddressList?.data[selectedAddress.index]?.address + ', ' + userAddressList?.data[selectedAddress.index]?.city_name + ', ' + userAddressList?.data[0]?.state_name + '-' + userAddressList?.data[selectedAddress.index]?.zip_code + ' ' + (userAddressList?.data[selectedAddress.index]?.landmark ? userAddressList.data[selectedAddress.index]?.landmark : '')}</Text>
                <Text style={{ color: 'black', marginVertical: 4 }}>{userAddressList?.data[selectedAddress.index]?.phone_no}{userAddressList?.data[selectedAddress.index]?.alternate_phone_no?',':''} {userAddressList?.data[selectedAddress.index]?.alternate_phone_no ? userAddressList.data[selectedAddress.index].alternate_phone_no : ''}</Text>
              </View>
            </View>:

              <View>
                <TouchableOpacity style={{width: '100%', backgroundColor: fBTheme.fBWhite, elevation: 5, padding: 10, flexDirection: 'row', alignItems: 'center', marginBottom:10}}
                onPress={() => AddNewAddress()}>
                  <Iconicons name="add" size={25} color={fBTheme.fBPurple} style={{ paddingHorizontal: 6 }} />
                  <Text style={{color: fBTheme.fBPurple, fontWeight: '500'}}>Add a new address</Text>
                </TouchableOpacity>
              </View>
            }

            <View style={{ padding: 10, backgroundColor: fBTheme.fBWhite, marginVertical: 6, borderRadius: 6 }}>
              <Text style={{ color: '#000', fontWeight: '500', marginBottom: 6, borderBottomWidth: .5, borderColor: fBTheme.fBLigh, paddingBottom: 4 }}>Price Details</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: '50%', paddingVertical: 6, color: '#000' }}>Price ({route.params.data} {route.params.data > 1 ? 'items' : 'item'})</Text>
                <Text style={{ width: '50%', paddingVertical: 6, textAlign: 'right', color: '#000', fontWeight: '500' }}>{'₹' + route.params.mrpTotal}</Text>
              </View>
              {/* <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: '50%', paddingVertical: 6, color: '#000' }}>Discount</Text>
                <Text style={{ width: '50%', paddingVertical: 6, textAlign: 'right', color: fBTheme.fBGreen, fontWeight: '500' }}>-₹{route.params.mrpTotal - route.params.total}</Text>
              </View> */}

              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: '50%', paddingVertical: 6, color: '#000' }}>Shipping Charges(+)</Text>
                {shippingCharge.status&&
                <Text style={{ width: '50%', paddingVertical: 6, textAlign: 'right', color: '#000', fontWeight:'500'}}>{'₹' + shippingCharge.charge}</Text>
                }
              </View>
              <View style={{ flexDirection: 'row', borderTopWidth: .5, borderBottomWidth: .5, marginTop: 10, borderColor: fBTheme.fBLigh }}>
                <Text style={{ width: '50%', paddingVertical: 6, color: '#000', fontWeight: 'bold' }}>Total Amount</Text>
                <Text style={{ width: '50%', paddingVertical: 6, textAlign: 'right', color: '#000', fontWeight: 'bold' }}>₹{Number(route.params.total)+shippingCharge.charge}</Text>
              </View>
            </View>
          </View>
          <ChackoutLayout 
            items={route.params.data} 
            total={Number(route.params.total)+shippingCharge.charge} 
            productID={route.params.productID}
            AddNewAddress={AddNewAddress} 
            navigation={navigation} 
            btnName ={'Continue'} 
            address={userAddressList?.data[selectedAddress.index]}
            fromCart={route.params.fromCart}
            singProdCartId={route.params.singProdCartId}
            quantity={route.params.quantity}
            // order={}
          />
        </View>
      }
      {addModal.status &&
        <AddressModal closePopup={closePopup} userAddressList={userAddressList} selectAddress={selectAddress} AddNewAddress={AddNewAddress} getShippingCharge={getShippingCharge}/>
      }
    </>
    ):null}
    <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected}/>
   
    </>
  )
}

function AddressModal({ closePopup, userAddressList, selectAddress, AddNewAddress, getShippingCharge}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
    >
      <View style={styles.garyContainer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => closePopup()}
        />

        <View style={styles.listBox}>

          <FlatList
            data={userAddressList.data}
            renderItem={({ item, index }) => <ListItem item={item} index={index} selectAddress={selectAddress} getShippingCharge={getShippingCharge}/>}
            keyExtractor={item => item.address_id}
          />
          <TouchableOpacity style={{ width: '100%', backgroundColor: fBTheme.fBPurple, padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => AddNewAddress()}>
            <Iconicons name="add" size={25} color={fBTheme.fBWhite} style={{ paddingHorizontal: 6 }} />
            <Text style={{ color: fBTheme.fBWhite, fontWeight: '500' }}>Add a new address</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => closePopup()}
        />
      </View>
    </Modal>
  )
}
function ListItem({item, index, selectAddress, getShippingCharge}) {
  return (
    <TouchableOpacity style={{ padding: 10, backgroundColor: fBTheme.fBWhite, marginVertical: 6, borderRadius: 6, elevation: 1}}
      onPress={() => selectAddress(item, index)}>
        <Text style={{ fontWeight: '500', color: 'black', marginVertical: 4 }}>{item.fullname}</Text>
        <Text style={{color:fBTheme.fbGray}}>{item.address + ', ' + item.city_name + ', ' + item.state_name + '-' + item.zip_code + ' ' + (item.landmark ? item.landmark : '')}</Text>
        <Text style={{ color: 'black', marginVertical: 4}}>{item.phone_no}{item.alternate_phone_no?',':''} {item.alternate_phone_no ? item.alternate_phone_no : ''}</Text>
    </TouchableOpacity>
  )
}

export default CheckOutScreen

const styles = StyleSheet.create({
  garyContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  listBox: {
    backgroundColor: fBTheme.fBLigh,
    maxHeight: '50%',
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 10,
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
    justifyContent: 'center',
    alignItems: 'center'

  },
  animationStyle: {
    width: 200,
    height: 200,
    alignSelf: 'center'
  }

})