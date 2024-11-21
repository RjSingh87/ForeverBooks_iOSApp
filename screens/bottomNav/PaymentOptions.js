import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { apiRoot, fBTheme, token } from '../../constant'
import Paytm from '../../assets/Paytm.webp';
import rPay from '../../assets/rpay.png';
import CCAvanue from '../../assets/CCAvenue.webp'
import SuccessImg from '../../assets/SuccessMsg.png'
import FailedImg from '../../assets/FailedMsg.png'
// import AllInOneSDKManager from 'paytm_allinone_react-native';
import { paytmConst } from '../../constant';
import { useDispatch, useSelector } from 'react-redux';
import services from '../../services';
import Loader from '../common/Loader';
import { MyData } from '../../Store';
import { fetchCardList } from '../reduxTookit/cart/CartListSlice';

import RazorpayCheckout from 'react-native-razorpay';


const PaymentOptions = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const userCartList = useSelector(state => state.cartList.data);
  const { addUserData, uniqueID } = useContext(MyData);
  const [tranStatus, setTranStatus] = useState({ status: false, data: null })

  // function paytmGatway() {
  //   const cartId = []
  //   if (!route.params.fromCart) {
  //     cartId.push(route.params.singProdCartId)
  //   } else {
  //     for (let cart of userCartList) {
  //       cartId.push(cart.cart_id)
  //     }
  //   }
  //   const orderPayload = {
  //     customer_id: addUserData.customer_id,
  //     address_id: route.params.address.address_id,
  //     cart_id: cartId,
  //     token: token
  //   }

  //   if (!route.params.fromCart){
  //     orderPayload["buy_now"] = 1;
  //     orderPayload["quantity"] = route.params.quantity
  //   }
  //   services.post(apiRoot.orderGenerate, orderPayload)
  //     .then((res) => {
  //       console.log(res, 'check response')
  //       const orderId = res.orderId
  //       const tranToken = res.txnToken
  //       const amount = JSON.stringify(res.total_amount)
  //       const callbackUrl = res.callbackUrl
  //       console.log(callbackUrl)
  //       AllInOneSDKManager.startTransaction(
  //         orderId,
  //         paytmConst.mid,
  //         tranToken,
  //         amount,
  //         callbackUrl,
  //         paytmConst.isStaging,
  //         paytmConst.restrictAppInvoke,
  //         paytmConst.urlScheme
  //       )
  //         .then((res) => {
  //           services.post(apiRoot.paymentStatus, res)
  //             .then((res) => {
  //             })
  //           if (res.STATUS == "TXN_SUCCESS"){
  //             setTranStatus((prev) => {
  //               return {...prev, status: true, data: res}
  //             });
  //             setTimeout(() => {
  //               setTranStatus((prev) => {
  //                 return { ...prev, status: false }
  //               });
  //               navigation.navigate('MyOrder')
  //             }, 2000)
  //             removeAllItems()
  //           } else {
  //             setTranStatus((prev) => {
  //               return { ...prev, status: true, data: res }
  //             })
  //           }
  //         })
  //         .catch((err) => {
  //           console.log(err, 'err...')
  //         });
  //     })
  //     .catch((err) => {
  //       console.log(err, 'res..')
  //     })
  // }

  function proceedToPay() {
    setIsLoading(true)
    const cartId = []
    if (!route.params.fromCart) {
      cartId.push(route.params.singProdCartId)
    } else {
      for (let cart of userCartList) {
        cartId.push(cart.cart_id)
      }
    }
    const postData = {
      customer_id: addUserData.customer_id,
      address_id: route.params.address.address_id,
      cart_id: cartId,
      token: token,
      isWeb: 1
    };
    services.post(apiRoot.books_buy, postData)
      .then((res) => {
        
        if (res.status == "success" && res.orderID) {
          setIsLoading(false)
          var options = {
            description: 'Credits towards consultation',
            image: require('../../assets/logo.png'),
            currency: 'INR',
            key: 'rzp_live_ESHYjQ2LWl9DNS',
            amount: res.amount_rupees * 100,
            name: 'Forever Books Pvt. Ltd.',
            order_id: res.orderID,//Replace this with an order_id created using Orders API.
            prefill: {
              email: 'foreverbook4583@gmail.com',
              contact: '91 9717 998857',
              name: 'Forever Books Pvt. Ltd.'
            },
            theme: { color: fBTheme.fBPurple }
          }
          RazorpayCheckout.open(options).then((data) => {
            if (data.razorpay_payment_id) {
              const xData = {
                "customer_id": addUserData.customer_id,
                "address_id": route.params.address.address_id,
                "token": token,
                "shippingCharge": res.shippingCharge,
                "razorpay_order_id": data.razorpay_order_id,
                "razorpay_payment_id": data.razorpay_payment_id,
                "razorpay_signature": data.razorpay_signature
              };

              // Verify payment details
              services.post(apiRoot.payment_verify, xData)
                .then((res) => {
                  console.log(res, 'check response')
                  if (res.status === "success") {
                    // handle success
                    navigation.navigate('MyOrder')
                    removeAllItems()
                  } else {
                    Alert.alert("Warning!", res.message)
                    // setTranStatus((prev) => {
                    //   return { ...prev, status: true, data: res.data}
                    // })
                  }
                })
                .catch((err) => alert(err))
                .finally(() => setIsLoading(false));
            } else {
              console.error('Missing razorpay_payment_id in response');
            }
            // alert(`Success: ${data.razorpay_payment_id}`);
          }).catch((error) => {
            // handle failure
            // alert(`Error: ${error.code} | ${error.description}`);
            // Alert.alert('Error', 'An error occurred during the payment process. Please try again.')
          });
        }else{
          Alert.alert('Warning', res.message ?? 'Failed to initiate payment. Please try again later.')
        }
      })






  }



  function removeAllItems() {
    const removeAllPayload = {
      "token": token,
      "customer_id": addUserData?.customer_id,
      "session_id": uniqueID
    }
    services.post(apiRoot.removeAllItemsFromCart, removeAllPayload)
      .then((res) => {
        if (res.status == "success") {
          getUserCartList()
        }
      })
  }

  function getUserCartList() {
    const cartListPayload = {
      "token": token,
      "customer_id": addUserData?.customer_id,
      "session_id": uniqueID
    }
    dispatch(fetchCardList(cartListPayload));
  }
  const toggleModal = () => {
    setTranStatus(false)
  };
  return (
    <View style={{ flex: 1, backgroundColor: fBTheme.fBLigh, padding: 10 }}>
      {isLoading &&
        <Loader />
      }
      {/* <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 10 }}>Select Your Payment Option</Text> */}
      {/* <View style={{ flex: 1, }}>
        <TouchableOpacity style={{ backgroundColor: fBTheme.fBWhite, flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 20, borderRadius: 4, marginVertical: 10 }}
          onPress={() => 
          paytmGatway()
          }
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, color: '#000' }}>Pay through Paytm</Text>
          </View>
          <View style={{ width: 70, height: 20 }}>
            <Image source={Paytm} style={{ width: '100%', height: '100%'}}/>
          </View>
        </TouchableOpacity>
      </View> */}


      <View style={{ flex: 1, }}>
        <TouchableOpacity style={{ backgroundColor: fBTheme.fBWhite, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 20, borderRadius: 4, marginVertical: 10 }}
          onPress={() =>
            proceedToPay()
          }
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, color: '#000', fontWeight: '700' }}>Pay through</Text>
          </View>
          <View style={{ width: 150, height: 30 }}>
            <Image source={rPay} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          </View>
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity disabled={true} style={{ backgroundColor: fBTheme.fBWhite, flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 20, borderRadius: 4, marginVertical: 10 }}
        onPress={() => ccAvanue()}>
        <View style={{flex: 1}}>
          <Text style={{ fontSize: 16, color: '#000'}}>Pay through CCAvenue</Text>
        </View>
        <View style={{ width: 120, height: 25 }}>
          <Image source={CCAvanue} style={{width: '100%', height: '100%'}}/>
        </View>
      </TouchableOpacity> */}

      {/* <ModalMsg isVisible={tranStatus.isSuccess}
        animationInTiming={300}
        animationOutTiming={600}
        style={{ width: '100%', margin: 0 }}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={toggleModal} />
        <View style={{ width: '90%', paddding: 10, borderRadius: 6, backgroundColor: fBTheme.fBGreen, alignSelf: 'center' }}>
          <Text style={{ padding: 10, color: '#fff', textAlign: 'center' }}>Payment Successful!</Text>
        </View>
        <TouchableOpacity style={{ flex: 0.1 }} onPress={toggleModal}/>
      </ModalMsg> */}

      {tranStatus.status &&
        <View style={styles.animationContainer}>
          <TouchableOpacity style={{ flex: 1, width: '100%' }} onPress={toggleModal} />
          <View style={{ width: '90%', borderRadius: 10, backgroundColor: fBTheme.fBWhite }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
              <Image source={tranStatus.data.status == "success" ? SuccessImg : FailedImg} style={{width: 50, height: 50}} />
            </View>
            <View style={{ padding: 10, justifyContent: 'center', borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
              <Text style={{ fontSize: 20, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
                {tranStatus.data.status == "success" ? "Transaction Successful" : "Transaction Failed"}
              </Text>
              <View style={{ backgroundColor: fBTheme.fBLigh, padding: 10, borderRadius: 10, marginVertical: 20 }}>
                <Text style={{ textAlign: 'center', paddingVertical: 6, fontWeight: 'bold', color: '#000', marginBottom: 6 }}>TRANSACTION DETAILS</Text>
                <View style={{ padding: 6 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ width: '50%', paddingVertical: 6, color: '#000' }}>Transaction Status:</Text>
                    <Text style={{ width: '50%', paddingVertical: 6, color: '#000' }}>{tranStatus.data.status}</Text>
                  </View>
                  {tranStatus.data.status == "success" &&
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ width: '50%', paddingVertical: 6, color: '#000' }}>Bank Transaction Id:</Text>
                      <Text style={{ width: '50%', paddingVertical: 6, color: '#000' }}>{tranStatus.data.status == "success" ? tranStatus.data.BANKTXNID : ''}</Text>
                    </View>
                  }
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ width: '50%', paddingVertical: 6, color: '#000' }}>Transaction Amount:</Text>
                    <Text style={{ width: '50%', paddingVertical: 6, color: '#000' }}>{tranStatus.data.TXNAMOUNT} {tranStatus.data.CURRENCY}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={{ padding: 10, width: '100%', backgroundColor: '#00b9f5', borderRadius: 4, alignSelf: 'center' }}
                onPress={() => {
                  if (tranStatus.data.STATUS == "TXN_SUCCESS") {
                    navigation.navigate('MyOrder')
                    setTranStatus(false)
                  } else {
                    navigation.navigate('Cart')
                    setTranStatus(false)
                  }
                }}
              >
                <Text style={{ textAlign: 'center', color: fBTheme.fBWhite }}>{tranStatus.data.STATUS == "TXN_SUCCESS" ? "Go to Review Your Order" : "Retry"}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={{ flex: 1, width: '100%' }} onPress={toggleModal} />
        </View>
      }
    </View>
  )
}

export default PaymentOptions
const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  animationStyle: {
    width: 80,
    height: 80,
    alignSelf: 'center'
  }
})