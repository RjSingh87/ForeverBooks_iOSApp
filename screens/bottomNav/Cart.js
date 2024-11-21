import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Animated, Alert, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../reduxTookit/cart/CartSlice';
import { apiRoot, fBTheme, token } from '../../constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Services from '../../services';
import { MyData } from '../../Store';
import ChackoutLayout from './ChackoutLayout';
import { fetchCardList } from '../reduxTookit/cart/CartListSlice';
import Loader from '../common/Loader';
import EmptyView from '../common/EmptyView';
import CheckInternet from '../appScreen/CheckInternet';
import {useFocusEffect, useIsFocused} from '@react-navigation/native'
import { cleanSingle } from 'react-native-image-crop-picker';

const Cart = ({ navigation, route }) => {
  const {addUserData, uniqueID, loginStatus} = useContext(MyData);
  const [isLoading, setIsLoading] = useState(false)
  const [scrollLoader, setScrollLoader] = useState(false)
  const userCartList = useSelector(state => state.cartList.data);
  const [isConnected, setIsConnected] = useState(false)
  const isFocuse = useIsFocused()
  
  const dispatch = useDispatch()

   
  useEffect(() => {
    getUserCartList()
  }, [])

  // useFocusEffect(
  //   React.useCallback(()=>{
  //     setScrollLoader(true);
  //     getUserCartList()
  //   },[isFocuse])
  // )
  function getUserCartList() {
    const cartListPayload = {
      "customer_id": addUserData?.customer_id,
      "token": token,
    }
    dispatch(fetchCardList(cartListPayload));
    setScrollLoader(false);
  }
  function removeCartItem(item) {
    const removeItemPayload = {
      "cart_id": item.cart_id,
      "token": token
    }
    Services.post(apiRoot.removeProductFromCart, removeItemPayload)
      .then((res) => {
        if (res.status == "success"){
          getUserCartList()
        }
      })
    }
  const showConfirmDialog = () => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove all items?",
      [
        {
          text: "Remove",
          onPress: () => {
            removeAllItems();
          },
        },
        {
          text: "Cancel",
        },
      ]
    );
  }
  function removeAllItems(){
    const removeAllPayload = {
      "token": token,
      "customer_id": addUserData?.customer_id,
      "session_id": uniqueID
    }
    Services.post(apiRoot.removeAllItemsFromCart, removeAllPayload)
      .then((res) => {
        console.log(JSON.stringify(res))
        if (res.status == "success") {
          getUserCartList()
        }
      })
  }
  function itemIncrement(item) {
    setIsLoading(true)
    const addtoCartPayload = {
      "token": token,
      "customer_id": addUserData?.customer_id,
      "session_id": uniqueID,
      "product_id": item.getProductDesc[0].product_id,
      "product_desc_id": item.product_desc_id,
      "quantity": 1
    }
    Services.post(apiRoot.addToCart, addtoCartPayload)
      .then((res) => {
        setIsLoading(true)
        if (res.status == 'success') {
          dispatch(addToCart(item))
          getUserCartList()
          setIsLoading(false)
        } else {
          Alert.alert('Info!',res.message);
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  function itemDecrement(item) {
    setIsLoading(true)
    const removeItemPayload = {
      "cart_id": item.cart_id,
      "token": token
    }
    Services.post(apiRoot.removeSingleItemFromCart, removeItemPayload)
      .then((res) => {
        if (res.status == "success") {
          setIsLoading(true)
          getUserCartList()
        } else {
          Alert.alert('Info!',res.message);
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  function getTotal() {
    let total = 0
    userCartList.map(item => {
      total = Number(total += item.getProductDesc[0].product_sale_price * item.quantity)
    })
    return total.toFixed(2);
  }
  function marpTotal() {
    let mrptotal = 0
    userCartList.map(item => {
      mrptotal = Number(mrptotal += item.getProductDesc[0].product_mrp_price * item.quantity)
    })
    return mrptotal.toFixed(2);
  }

  function viewProductDetail(item, ind) {
    navigation.navigate('BookDetail',{
      data: item, index: ind
    })
  }
  
  return (
    <>
      {isConnected == true ? (
        <>
          {isLoading &&
            <Loader/>
          }
          <View style={{ flex: 1, backgroundColor: fBTheme.fBLigh, padding: 10}}>
            <>
              {userCartList.length > 0 &&
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6,}}>
                  <View style={{ padding: 4 }}>
                    <Text style={{ fontWeight: '600', color: '#000' }}>Added to Cart</Text>
                  </View>
                  <TouchableOpacity style={{ backgroundColor: fBTheme.fBPurple, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 6 }}
                    onPress={() => showConfirmDialog()}
                  >
                    <Text style={{ color: fBTheme.fBLigh }}>Remove all</Text>
                  </TouchableOpacity>
                </View>
              }

              <ScrollView style={{marginBottom: 70}}
                contentContainerStyle = {{flexGrow: 1, justifyContent: userCartList.length > 0 ? null:'center'}}
                refreshControl={
                  <RefreshControl
                    refreshing={scrollLoader}
                    onRefresh={()=>{
                      setScrollLoader(true);
                      getUserCartList();
                    }}
                    tintColor={fBTheme.fBPurple}
                    title='Refresh'
                  />}
              >
                {userCartList.length > 0?
                  <View style={{}}>
                    {userCartList?.map((item, index) => {
                      let salePrice = item.getProductDesc[0].product_sale_price * item.quantity
                      let mrpPrice = item.getProductDesc[0].product_mrp_price * item.quantity
                      return (
                        <View style={{marginVertical: 5, flexDirection: 'row', flex: 1, padding: 10, borderRadius: 6, backgroundColor: fBTheme.fBWhite, elevation: .7}} key={index}
                        >
                          <TouchableOpacity style={{width: 100, height: 120, borderRadius: 6, overflow: 'hidden'}}
                           onPress={() => viewProductDetail(item.product_id, index)}
                          >
                            <Image style={{width: '100%', height: '100%'}} source={{uri: item.getProductName.product_image_path + item.getProductDesc[0].product_cover_image}}/>
                          </TouchableOpacity>
                          <View style={{paddingHorizontal: 15, flex: 1}}>
                            <View style={{flex: 1}}>
                              <Text style={{fontSize: 15, color: '#000', fontWeight: 'bold', textTransform: 'capitalize'}}>{item.getProductName.product_name.length > 30 ? item.getProductName.product_name.substring(0, 27) + '...' : item.getProductName.product_name}</Text>
                              <Text style={{color: '#000'}}>{item.getProductDesc[0].getBookTypeName.book_type_name}</Text>

                              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
                                <Text style={{ color: '#000' }}>{'₹' + salePrice.toFixed(2)}</Text>
                                {salePrice<mrpPrice?
                                <Text style={{ marginLeft: 16, textDecorationLine: 'line-through', color:fBTheme.fbGray}}>{'₹' + mrpPrice.toFixed(2)}</Text>:null
                                }
                              </View>
                            </View>

                            <View style={{ width: '100%', height: 30, flexDirection: 'row', marginTop: 15, justifyContent: 'space-between'}}>
                              <View style={{ width: '60%', borderRadius: 4, flex: 1, paddingHorizontal: 6, flexDirection: 'row' }}>
                                <TouchableOpacity style={{ width: 35, borderRadius: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: fBTheme.fBPurple, opacity: item.quantity == 1 ? .5 : 1 }}
                                  disabled={item.quantity == 1 ? true : false}
                                  onPress={() => {
                                    itemDecrement(item)
                                  }}
                                >
                                  <Text style={{ textAlign: 'center', color: fBTheme.fBWhite }}>-</Text>
                                </TouchableOpacity>

                                <Text style={{ width: 45, paddingHorizontal: 4, paddingVertical: 6, textAlign: 'center', color:'#000' }}>{item.quantity}</Text>

                                <TouchableOpacity style={{width: 35, borderRadius: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: fBTheme.fBPurple,}}
                                  onPress={() => {
                                    itemIncrement(item)
                                  }}
                                >
                                  <Text style={{ textAlign: 'center', color: fBTheme.fBWhite}}>+</Text>
                                </TouchableOpacity>
                              </View>

                              <TouchableOpacity style={{}}
                                onPress={() => {removeCartItem(item)}}>
                                <MaterialCommunityIcons name={'delete'} size={30} color={fBTheme.fBRed}/>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        
                      )
                    })}
                    </View>:
                  <EmptyView mainMsg={'Your shopping cart is empty.'} subMsg={'Add items you want to shop.'} btnName={'Shop Now'} onpressFunction={() => navigation.goBack()}/>
                }
              </ScrollView>
              {userCartList.length > 0 &&
                <ChackoutLayout items={userCartList.length} total={getTotal()} navigation={navigation} btnName={'Checkout'} mrpTotal={marpTotal()} fromCart={1}/>
              }
            </>
          </View>
        </>
      ) : null}
      <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected}/>

    </>
  )
}
export default Cart
const styles = StyleSheet.create({
})