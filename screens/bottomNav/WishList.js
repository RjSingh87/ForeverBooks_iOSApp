import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, RefreshControl, Alert } from 'react-native'
import ModalMsg from "react-native-modal";
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeToCart } from '../reduxTookit/cart/CartSlice';
import { apiRoot, fBTheme, token } from '../../constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EmptyView from '../common/EmptyView';

import { MyData } from '../../Store';
import { fetchWishList } from '../reduxTookit/wishList/WishListSlice';
import { addToWishlist, } from '../reduxTookit/wishList/AddWishSlice';
import services from '../../services';
import { fetchCardList } from '../reduxTookit/cart/CartListSlice';
import CheckInternet from '../appScreen/CheckInternet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';


const WishList = ({ navigation }) => {
  const dispatch = useDispatch()
  const userWishList = useSelector(state => state.wishList);
  const { addUserData, uniqueID, loginStatus } = useContext(MyData);
  const [isModalVisible, setModalVisible] = useState({ status: false, msg: '' });
  const [scrollLoader, setScrollLoader] = useState(false);
  const [isConnected, setIsConnected] = useState(false)

  const toggleModal = () => {
    setModalVisible(!isModalVisible.status);
  };

  useEffect(() => {
    getWishList()
  }, [])

  const getWishList = () => {
    const wishListPayload = {
      "customer_id": addUserData?.customer_id,
      "token": token,
      "session_id": uniqueID
    }
    dispatch(fetchWishList(wishListPayload))
    setScrollLoader(false)
  }

  const removeFromWishList = (item) => {
    let addWishListPayload = null
    if (loginStatus.isLogin) {
      addWishListPayload = {
        "customer_id": addUserData?.customer_id,
        "session_id": uniqueID,
        "product_id": item.product_id,
        "product_desc_id": item.get_product_desc[0].product_desc_id,
        "token": token
      }

    } else {
      addWishListPayload = {
        "session_id": uniqueID,
        "customer_id": addUserData?.customer_id,
        "product_id": item.product_id,
        "product_desc_id": item.get_product_desc[0].product_desc_id,
        "token": token
      }
    }

    services.post(apiRoot.addToWishList, addWishListPayload)
      .then((res) => {
        if (res.status == 'success') {
          // alert(res.message)
          dispatch(addToWishlist(item));//for test
          getWishList()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const moveToCart = (item) => {
    if (item.get_product_desc[0].total_stock > 0) {
      if (loginStatus.isLogin == true) {
        const addtoCartPayload = {
          "token": token,
          "customer_id": addUserData?.customer_id,
          "session_id": uniqueID,
          "product_id": item.product_id,
          "product_desc_id": item.get_product_desc[0].product_desc_id,
          "quantity": 1
        }
        services.post(apiRoot.addToCart, addtoCartPayload)
          .then((res) => {
            if (res.status == 'success') {
              setModalVisible((prev) => {
                return { ...prev, status: true, msg: res.message }
              });
              setTimeout(() => {
                dispatch(addToCart(item));//for test
                removeFromWishList(item)
                getUserCartList();
                setModalVisible((prev) => {
                  return { ...prev, status: false }
                })
              }, 1000);

            }
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
          })
      } else {
        navigation.navigate('TabAccount')
      }

    } else {
      Alert.alert('Info!', 'Product is out of stock.')
    }
  }
  function getUserCartList() {
    const cartListPayload = {
      "token": token,
      "customer_id": addUserData?.customer_id,
      "session_id": uniqueID
    }
    dispatch(fetchCardList(cartListPayload));
    setScrollLoader(false)
  }

  // const onRefresh = useCallback(() => {
  //   setScrollLoader(true);
  //   // getCustomerProfileData();
  //   getWishList();
  // }, []);

  function viewProductDetail(item, ind) {
    // alert('api corr variable cannot match with bookdetail data')
    navigation.navigate('BookDetail', {
      data: item, index: ind
    })
  }

  return (
    <SafeAreaView edges={["left", "right", "top"]} style={{ flex: 1, backgroundColor: fBTheme.fBPurple }}>
      {isConnected == true ? (
        <View style={{ flex: 1, backgroundColor: fBTheme.fBLigh, padding: 10 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: userWishList.data.length > 0 ? null : 'center' }}
            refreshControl={
              <RefreshControl
                refreshing={scrollLoader}
                onRefresh={() => {
                  setScrollLoader(true);
                  getWishList();

                }}
                tintColor={fBTheme.fBPurple}
                title='Refresh'
              />}

          >
            {userWishList.data.length > 0 ?
              <View>
                {userWishList.data?.map((item, index) => {
                  return (
                    <TouchableOpacity style={{ marginVertical: 5, flexDirection: 'row', flex: 1, padding: 10, borderRadius: 6, backgroundColor: fBTheme.fBWhite, elevation: .7 }} key={index}
                      onPress={() => viewProductDetail(item.product_id, index)}
                    >
                      <View style={{ width: 100, height: 120, borderRadius: 6, overflow: 'hidden' }}>
                        <Image style={{ width: '100%', height: '100%' }} source={{ uri: item.get_product_name?.product_image_path + item.get_product_desc[0]?.product_cover_image }} />
                      </View>
                      <View style={{ paddingHorizontal: 15, flex: 1 }}>

                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 15, color: '#000', fontWeight: 'bold' }}>{item.get_product_name.product_name.length > 20 ? item.get_product_name.product_name.substring(0, 20) + '...' : item.get_product_name.product_name}</Text>
                          <Text style={{ color: '#000', marginVertical: 4 }}>{item.get_product_desc[0]?.getBookTypeName?.book_type_name}</Text>

                          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                            <Text style={{ color: '#000', fontWeight: '700' }}>{'₹ ' + item.get_product_desc[0]?.product_sale_price}</Text>
                            {item.get_product_desc[0]?.product_sale_price < item.get_product_desc[0]?.product_mrp_price ?
                              <Text style={{ marginLeft: 16, textDecorationLine: 'line-through', color: fBTheme.fbGray }}>{'M.R.P ₹ ' + item.get_product_desc[0]?.product_mrp_price}</Text> : null
                            }
                          </View>
                        </View>
                        <View style={{ width: '100%', height: 30, marginTop: 15 }}>
                          <TouchableOpacity style={{ borderRadius: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: fBTheme.fBPurple, paddingVertical: 6, width: 100 }}
                            onPress={() => {
                              moveToCart(item)
                            }
                            }>
                            <Text style={{ textAlign: 'center', color: fBTheme.fBWhite }}>Move to Cart</Text>
                          </TouchableOpacity>

                        </View>

                      </View>
                      <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, padding: 4 }}
                        onPress={() => removeFromWishList(item)}
                      >
                        <Ionicons name="heart" size={25} color={fBTheme.fBRed} />

                      </TouchableOpacity>
                    </TouchableOpacity>
                  )
                })}

              </View> :
              <EmptyView mainMsg={'Your Wish List is empty.'} />
            }
          </ScrollView>

          <ModalMsg isVisible={isModalVisible.status}
            animationInTiming={600}
            animationOutTiming={1000}
            style={{ width: '100%', margin: 0 }}>
            <TouchableOpacity style={{ flex: 1 }} />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 60, height: 60, backgroundColor: fBTheme.fBWhite, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>
                <AntDesign name='checkcircleo' size={30} color={fBTheme.fBGreen} />
              </View>
              <View style={{ flex: 1.5, justifyContent: 'center', backgroundColor: fBTheme.fBWhite, padding: 10, borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
                <Text>{isModalVisible.msg}</Text>
              </View>
            </View>
            <TouchableOpacity style={{ flex: .3 }} />
          </ModalMsg>
        </View>
      ) : null}
      <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
    </SafeAreaView>
  )
}
export default WishList
const styles = StyleSheet.create({
  // animationStyle: {
  //   width: 200,
  //   height: 200,
  //   alignSelf: 'center'
  // }
})