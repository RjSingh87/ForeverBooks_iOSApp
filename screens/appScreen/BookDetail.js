import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal, RefreshControl, Alert } from 'react-native'
import React, { useContext, useState, useEffect, useCallback } from 'react'
import ModalMsg from "react-native-modal";
import { fBTheme, token, apiRoot } from '../../constant'
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Pinchable from 'react-native-pinchable';

import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { MyData } from '../../Store';
import { useDispatch, useSelector } from 'react-redux';
import Services from '../../services';
import { fetchWishList } from '../reduxTookit/wishList/WishListSlice';
import { fetchCardList } from '../reduxTookit/cart/CartListSlice';
import { featchSingleProduct } from '../reduxTookit/product/SingleProductSlice';
import Loader from '../common/Loader';
import CheckInternet from './CheckInternet';
import AntDesign from 'react-native-vector-icons/AntDesign';



const BookDetail = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const productID = route.params.data
  const singleProduct = useSelector(state => state.singleProduct)
  const userWishList = useSelector(state => state.wishList)

  const [selectedBookType, setSelectedBookType] = useState({ data: null, selectedType: null });
  const [bookTypeisVisible, setBookTypeisVisible] = useState(false);
  const { loginStatus, addUserData, uniqueID } = useContext(MyData);
  const [product, setProduct] = useState({ qty: 1, status: false });
  const [isModalVisible, setModalVisible] = useState({ status: false, msg: '' });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setLoading] = useState(false)

  const tagsStyles = {
    body: {
      fontSize: 14,
      color: fBTheme.fbGray
    },
    h1: {
      fontSize: 16,
      color: fBTheme.fbGray
    },
    h2: {
      fontSize: 14,
      color: fBTheme.fbGray
    },
    p: {
      fontSize: 14,
      color: fBTheme.fbGray
    }
  };


  useEffect(() => {
    getProductDetail();
  }, []);

  useEffect(() => {
    let selectedType = null
    selectedType = singleProduct?.data?.getProductDesc?.[0];
    setSelectedBookType((prev) => { return { ...prev, data: singleProduct.data, selectedType: selectedType } })
  }, [singleProduct])

  const onRefresh = useCallback(() => {
    setLoading(true);
    getProductDetail()
  }, []);

  const dispatch = useDispatch()
  function getProductDetail() {
    const productDetail = {
      "token": token,
      "product_id": productID,
    }
    dispatch(featchSingleProduct(productDetail));
    setLoading(false)
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible.status);
  };

  function selectBookType() {
    setBookTypeisVisible(true)
  }

  function getBookTypeData(val, ind) {
    setSelectedBookType((prev) => {
      return { ...prev, selectedType: val }
    })
    setBookTypeisVisible(false)
  }

  function selectQty() {
    setProduct((prev) => {
      return { ...prev, status: true }
    })
  }
  function getQtyNumber(item, index) {
    setProduct((prev) => {
      return { ...prev, qty: item, status: false }
    })
  }
  const addtoCartItem = (item, type) => {
    if (selectedBookType?.selectedType?.total_stock > 0) {
      if (loginStatus.isLogin == true) {
        const addtoCartPayload = {
          "token": token,
          "customer_id": addUserData.customer_id,
          "product_id": item.data.product_id,
          "product_desc_id": item.selectedType.product_desc_id,
          "quantity": product.qty
        }
        if (type == "buyNow") {
          addtoCartPayload["buy_now"] = 1
        }
        Services.post(apiRoot.addToCart, addtoCartPayload)
          .then((res) => {
            if (res.status == 'success') {
              if (res.message) {
                setModalVisible((prev) => {
                  return { ...prev, status: true, msg: res.message }
                }),
                  setTimeout(() => {
                    getUserCartList()
                    setModalVisible((prev) => {
                      return { ...prev, status: false }
                    })
                  }, 2500);

              }

              if (type == 'buyNow') {
                buyNowSingleProduct(res.cartID)
              }
            } else {
              setModalVisible((prev) => {
                return { ...prev, status: true, msg: res.message }
              });
              setTimeout(() => {
                getUserCartList()
                setModalVisible((prev) => {
                  return { ...prev, status: false }
                })
              }, 2500);
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
      Alert.alert('Info!','Product is out of stock.')
    }
  }
  function getUserCartList() {
    const cartListPayload = {
      "token": token,
      "customer_id": addUserData?.customer_id,
      "session_id": uniqueID
    }
    dispatch(fetchCardList(cartListPayload));
  }
  const addItemtoWishList = (item) => {
    if (loginStatus.isLogin == true) {
      const addWishListPayload = {
        "customer_id": addUserData?.customer_id,
        "session_id": uniqueID,
        "product_id": item.selectedType.product_id,
        "product_desc_id": item.selectedType.product_desc_id,
        "token": token,
      }
      Services.post(apiRoot.addToWishList, addWishListPayload)
        .then((res) => {
          if (res.status == 'success') {
            setModalVisible((prev) => {
              return { ...prev, status: true, msg: res.message }
            })
            setTimeout(() => {
              getWishList()
              setModalVisible((prev) => {
                return { ...prev, status: false }
              })
            }, 2500);
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      navigation.navigate('TabAccount')
    }

  }
  const getWishList = () => {
    const wishListPayload = {
      "customer_id": addUserData?.customer_id,
      "token": token,
      "session_id": uniqueID
    }
    dispatch(fetchWishList(wishListPayload))
  }

  function buyNow(item) {
    addtoCartItem(item, "buyNow")
  }

  function buyNowSingleProduct(singProdCartId) {
    if (selectedBookType.selectedType.total_stock > 0) {
      if (loginStatus.isLogin == true) {
        navigation.navigate('CheckOutScreen', { data: 1, total: (selectedBookType.selectedType.product_sale_price * product.qty), mrpTotal: (selectedBookType.selectedType.product_mrp_price * product.qty), productID: productID, fromCart: 0, singProdCartId: singProdCartId, quantity: product.qty })
      } else {
        navigation.navigate('TabAccount')
      }
    } else {
      Alert.alert('Info!','product is out of stock.')
    }
  }
  function closePopup() {
    setBookTypeisVisible(false);
    setProduct((prev) => {
      return { ...prev, status: false }
    })
  }
  let iconName = 'heart-outline'
  userWishList.data.map((item) => {
    if (selectedBookType?.selectedType?.product_desc_id == item.get_product_desc[0].product_desc_id) {
      iconName = 'heart'
    }
    return
  })

  return (
    <>
      {isConnected == true ? (
        <>
          {selectedBookType.data == null || selectedBookType.selectedType == null ?
            <Loader />
            :
            <View style={{ flex: 1, backgroundColor: fBTheme.fBLigh, alignItems: 'center', padding: 10 }}>
              <ScrollView style={{ width: '100%' }}
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={onRefresh}
                    tintColor={fBTheme.fBPurple}
                    title='Refresh'
                  />
                }
              >
                <View style={{ backgroundColor: fBTheme.fBWhite, width: '100%', elevation: .01, padding: 10 }}>
                  <View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                      {selectedBookType.data != null &&
                        <Pinchable>
                          <Image source={{ uri: selectedBookType?.data?.product_image_path + selectedBookType?.selectedType?.product_cover_image }} style={{ width: 200, height: 250 }} />
                        </Pinchable>
                      }
                      {/* wishList------BTN */}
                      <TouchableOpacity style={{ position: 'absolute', width: 40, height: 40, backgroundColor: '#fff', display: 'flex', borderRadius: 50, elevation: 1, alignItems: 'center', justifyContent: 'center', zIndex: 999, right: 10, bottom: '50%'}}
                        onPress={() => addItemtoWishList(selectedBookType)}
                      >
                        <Ionicons name={iconName} size={35} color={fBTheme.fBRed} style={{}}/>
                      </TouchableOpacity>
                      {/* wishList------BTN */}
                    </View>
                    <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
                      <Text style={styles.productName}>{singleProduct?.data?.product_name}</Text>
                      {singleProduct?.data?.product_short_desc?(
                        <Text style={{marginTop: 10, color: fBTheme.fbGray}}>{singleProduct?.data?.product_short_desc}</Text>
                      ):null}
                      <View style={{flexDirection: 'row', width: '100%', marginTop: 20, justifyContent: 'space-between'}}>
                        <View style={{width: 150}}>
                          <TouchableOpacity style={{borderWidth: .5, padding: 4, borderRadius: 4, flexDirection: 'row', justifyContent: 'space-between'}}
                            onPress={() => selectBookType()}
                          >
                            <Text style={{color: fBTheme.fbGray}}>{selectedBookType?.selectedType?.getBookTypeName.book_type_name}</Text>
                            <Ionicons name='chevron-down-outline' size={20}/>
                          </TouchableOpacity>
                        </View>
                          {selectedBookType?.selectedType?.total_stock> 0?
                          <>
                            <View style={{width: 60 }}>
                              <TouchableOpacity style={{ borderWidth: .5, padding: 4, borderRadius: 4, flexDirection: 'row', justifyContent: 'space-between'}}
                                onPress={() => selectQty()}>
                                <Text style={{color: fBTheme.fbGray}}>{product.qty}</Text>
                                <Ionicons name='chevron-down-outline' size={20}/>
                              </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                              <Feather name="check-circle" size={20} color={fBTheme.fBGreen} style={{ marginRight: 10}}/>
                              <Text style={{ fontWeight: '500', color: fBTheme.fBGreen }}>In Stock</Text>
                            </View>
                          </>
                          :
                          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <SimpleLineIcons name="close" size={20} color={fBTheme.fBRed} style={{marginRight: 10}}/>
                            <Text style={{fontWeight: '500', color: fBTheme.fBRed }}>Out of Stock</Text>
                          </View>
                        }
                      </View>
                      <View style={{ marginTop: 20, flexDirection: 'row', borderTopWidth: .5, borderBottomWidth: .5, borderColor: fBTheme.fBPurple, alignItems: 'center', paddingVertical: 15 }}>
                        <Text style={{ fontSize: 20, color: fBTheme.fBGreen }}>{'₹' + selectedBookType?.selectedType?.product_sale_price*product.qty}</Text>
                        {(selectedBookType?.selectedType?.product_sale_price*product.qty)<(selectedBookType?.selectedType?.product_mrp_price*product.qty)?
                        <Text style={{ fontSize: 14, marginLeft: 16, color: fBTheme.fbGray, textDecorationLine: 'line-through', }}>{'M.R.P ₹' + selectedBookType?.selectedType?.product_mrp_price*product.qty}</Text>:null
                        }
                        {/* {selectedBookType?.selectedType?.product_sale_price*product.qty==selectedBookType?.selectedType?.product_mrp_price*product.qty
                        ?
                        <Text>{selectedBookType?.selectedType?.product_sale_price*product.qty==selectedBookType}</Text>
                        :null
                        } */}
                      </View>

                      {selectedBookType?.selectedType?.discount?.length || selectedBookType?.selectedType?.specialDiscount?.length || selectedBookType?.selectedType?.offer?.length ?

                        <View style={{ borderBottomWidth: .5, borderColor: fBTheme.fBPurple, paddingVertical: 15}}>
                          <Text style={{fontWeight: 'bold', color: fBTheme.fBPurple, marginBottom: 4}}>Discounts & Offers</Text>

                          {selectedBookType?.selectedType?.discount?.length > 0 &&
                            <View style={{flexDirection: 'row', marginVertical: 4}}>
                              <MaterialIcons name="local-offer" size={18} color={fBTheme.fBRed} style={{width: 30, justifyContent: 'center'}}/>
                              <Text style={{ color: fBTheme.fbGray, fontWeight: '500' }}>Discount : </Text>
                              <Text>{selectedBookType.selectedType?.discount[0]?.discountName}</Text>
                            </View>
                          }

                          {selectedBookType?.selectedType?.specialDiscount?.length > 0 &&
                            <View style={{flexDirection: 'row', marginVertical: 4}}>
                              <MaterialIcons name="local-offer" size={18} color={fBTheme.fBRed} style={{ width: 30, justifyContent: 'center'}} />
                              <Text style={{color: fBTheme.fbGray, fontWeight: '500'}}>Additional Discount : </Text>
                              <Text>{selectedBookType.selectedType?.specialDiscount[0]?.discountName}</Text>
                            </View>

                          }
                          {selectedBookType?.selectedType?.offer?.length > 0 &&
                            <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                              <MaterialIcons name="local-offer" size = {18} color={fBTheme.fBRed} style={{width: 30, justifyContent: 'center'}} />
                              <Text style={{ color: fBTheme.fbGray, fontWeight: '500' }}>Offer : </Text>
                              <Text>{selectedBookType.selectedType?.offer[0]?.offer_code}</Text>
                            </View>
                          }

                        </View> :
                        null
                      }





                    </View>
                  </View>
                  <View>

                    <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                      <View style={{ width: 100, }}>
                        <Text style={styles.boldText}>Binding:</Text>
                      </View>
                      <View style={{ flex: 1, paddingLeft: 6 }}>
                        <Text style={{ color: fBTheme.fbGray }}>{selectedBookType?.selectedType.book_binding_type}</Text>
                      </View>
                    </View>


                    <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                      <View style={{ width: 100, paddingTop: 6 }}>
                        <Text style={styles.boldText}>Publisher:</Text>
                      </View>
                      <View style={{ flex: 1, paddingLeft: 6, paddingTop: 6 }}>
                        <Text style={{ color: fBTheme.fbGray }}>{selectedBookType?.data?.getPublisherName.publisher_name}</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                      <View style={{ width: 100, paddingTop: 6 }}>
                        <Text style={styles.boldText}>Author:</Text>
                      </View>
                      <View style={{ flex: 1, paddingLeft: 6, paddingTop: 6 }}>
                        <Text style={{ color: fBTheme.fbGray }}>{selectedBookType?.data?.author_name}</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                      <View style={{ width: 100, paddingTop: 6 }}>
                        <Text style={styles.boldText}>ISBN:</Text>
                      </View>
                      <View style={{ flex: 1, paddingLeft: 6, paddingTop: 6 }}>
                        <Text style={{ color: fBTheme.fbGray }}>{selectedBookType?.data?.isbn_number}</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                      <View style={{ width: 100, paddingTop: 6 }}>
                        <Text style={styles.boldText}>Weight:</Text>
                      </View>
                      <View style={{ flex: 1, paddingLeft: 6, paddingTop: 6 }}>
                        <Text style={{ color: fBTheme.fbGray }}>{selectedBookType?.selectedType?.total_weight + ' ' + selectedBookType?.selectedType?.unit}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                      <View style={{ width: 100, paddingTop: 6 }}>
                        <Text style={styles.boldText}>Pages:</Text>
                      </View>
                      <View style={{ flex: 1, paddingLeft: 6, paddingTop: 6 }}>
                        <Text style={{ color: fBTheme.fbGray }}>{selectedBookType?.selectedType.total_pages}</Text>
                      </View>
                    </View>
                  </View>

                  {selectedBookType?.data?.product_desc?
                  (
                    <View style={{ paddingBottom: 6, borderTopWidth: .5, marginTop: 20 }}>
                    <Text style={{ textAlign: 'center', fontWeight: '600', color: '#000', marginVertical: 6 }}>Discription:</Text>
                    <RenderHtml
                      contentWidth={width}
                      source={{ html: selectedBookType?.data?.product_desc }}
                      tagsStyles={tagsStyles}
                    />
                  </View>
                  ):
                  null}

                 
                </View>

                {bookTypeisVisible &&
                  <BookTypeList productList={selectedBookType} closePopup={closePopup} getBookTypeData={getBookTypeData} />
                }

                {product.status &&
                  <QuantytyList prodQty={selectedBookType?.selectedType?.total_stock} closePopup={closePopup} getQtyNumber={getQtyNumber} />
                }


                <View style={{ marginTop: 20, padding: 10, borderTopWidth: 1, borderColor: fBTheme.fBPurple }}>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Suggest Books</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  </View>

                </View>



              </ScrollView>
            </View>


          }







          <View style={{
            flexDirection: 'row', justifyContent: 'center', backgroundColor: fBTheme.fBLigh, paddingVertical: 10, position: 'absolute', bottom: 0, right: 0, left: 0,
          }}>
            <TouchableOpacity style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
              onPress={() => addtoCartItem(selectedBookType)}
            >
              <View style={{ padding: 10, width: 150, borderRadius: 6, backgroundColor: '#1A1A1A' }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: fBTheme.fBWhite }}>Add to Cart</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
              onPress={() => buyNow(selectedBookType)}
            >
              <View style={{ padding: 10, width: 150, borderRadius: 6, backgroundColor: '#069C70' }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: fBTheme.fBWhite }}>Buy Now</Text>
              </View>
            </TouchableOpacity>
          </View>
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

        </>

      ) : null}
      <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
    </>
  )
};

function BookTypeList({ closePopup, productList, getBookTypeData }) {

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
          <ScrollView>
            {productList?.data?.getProductDesc.map((item, index) => {
              
              let clsName = 'radio-button-off'
              if (productList.selectedType.getBookTypeName.book_type_id == item.getBookTypeName.book_type_id) {
                clsName = 'radio-button-on'
              }
              return (
                <TouchableOpacity
                  key={item.product_desc_id}
                  onPress={() => { getBookTypeData(item, index) }}
                  style={styles.selectItemContainer}>
                  <View style={styles.radioBox}>
                    <Ionicons name={clsName} color={fBTheme.fBPurple} size={20} />
                  </View>
                  <Text style={{ color: fBTheme.fbGray }}>{item.getBookTypeName.book_type_name}</Text>
                </TouchableOpacity>
              )
            })
            }
          </ScrollView>
        </View>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => closePopup()}
        />
      </View>
    </Modal>
  )
}


function QuantytyList({ prodQty, closePopup, getQtyNumber }) {
  let newArray = []
  for (i = 1; i <= prodQty; i++) {
    newArray.push(i)
  }

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
          <ScrollView>
            {newArray.map((item, index) => {
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => { getQtyNumber(item, index) }}
                  style={styles.selectItemContainer}>
                  <Text style={{ color: fBTheme.fbGray }}>{item}</Text>
                </TouchableOpacity>
              )
            })

            }

          </ScrollView>
        </View>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => closePopup()}
        />
      </View>
    </Modal>
  )
}

export default BookDetail
const styles = StyleSheet.create({
  garyContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  listBox: {
    backgroundColor: '#fff',
    maxHeight: '50%',
    minHeight: 50,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  selectItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    borderBottomWidth: 1,
    borderColor: "#DADADB",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 4
  },
  radioBox: {
    paddingHorizontal: 10,

  },
  productName: {
    fontWeight: '700', color: '#000', fontWeight: '500', textTransform: 'capitalize', fontSize: 16
  },

  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center'

  },
  animationStyle: {
    width: 200,
    height: 200,
    alignSelf: 'center'
  },
  h1: {
    fontSize: 12
  },
  boldText: {
    fontWeight: '700',
    color: fBTheme.fbGray
  }




})