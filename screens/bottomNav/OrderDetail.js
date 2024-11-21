import { StyleSheet, Text, View, Image, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { apiRoot, fBTheme, token } from '../../constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomerSupport from './CustomerSupport';
import CheckInternet from '../appScreen/CheckInternet';
import services from '../../services';
// import Pdf from 'react-native-pdf';

const OrderDetail = ({ navigation, route }) => {
    const orderData = route.params.data
    const bookBaseUrl = route.params.url
    const orderDate = route.params.orderDate
    const orderTime = route.params.orderTime

    const [isLoading, setLoading] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [corriorStatus, serCorriorStatus] = useState(0)
    const [pdfData, setPdfData] = useState({ data: null, status: false })


    const onRefresh = useCallback(() => {
        setLoading(true);
    }, []);

    setTimeout(() => {
        setLoading(false);
    }, 1000)

    function downloadInvoice() {
        const invoicePayload = {
            customerID: orderData.customer_id,
            orderID: orderData.order_id,
            token: token
        }
        services.post(apiRoot.generatePDFInvoice, invoicePayload)
            .then((res) => {
                setPdfData((prev) => {
                    return { ...prev, data: res, status: true }
                })
                navigation.navigate('PdfViewer', { data: res })
                // const pdfDataInterval = setInterval(()=>{
                //     console.log(pdfData.status)
                //     if(pdfData.status){
                //         clearInterval(pdfDataInterval)
                //         navigation.navigate('PdfViewer', {data:pdfData})
                //     }
                // },100)
            })
    }

    return (
        <>
            {isConnected == true ? (
                <View style={{ flex: 1, backgroundColor: fBTheme.fBLigh, padding: 10 }}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading}
                                onRefresh={onRefresh}
                                tintColor={fBTheme.fBPurple}
                                title='Refresh'
                            />
                        }
                    >
                        <View style={{ marginVertical: 5, padding: 10, borderRadius: 6, backgroundColor: fBTheme.fBWhite, elevation: .7 }}>
                            <Text style={{ borderBottomWidth: .5, width: '100%', paddingVertical: 6, borderColor: fBTheme.fBPurple, color: '#000', fontWeight: 'bold' }}>Order Detail</Text>
                            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                <Text style={{ width: '50%', color: fBTheme.fbGray }}>Order Date:</Text>
                                <Text style={{ width: '50%', color: fBTheme.fbGray }}>{orderDate ? orderDate : null}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                <Text style={{ width: '50%', color: fBTheme.fbGray }}>Order Time:</Text>
                                <Text style={{ width: '50%', color: fBTheme.fbGray }}>{orderTime ? orderTime : null}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                <Text style={{ width: '50%', color: fBTheme.fbGray }}>Order No:</Text>
                                <Text style={{ width: '50%', color: fBTheme.fbGray }}>{orderData?.order_no}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                <Text style={{ width: '50%', color: fBTheme.fbGray }}>Payment Method:</Text>
                                <Text style={{ width: '50%', color: fBTheme.fbGray }}>{orderData?.payment_method}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                <Text style={{ width: '50%', color: '#000', fontWeight: 'bold' }}>Total Amount:</Text>
                                <Text style={{ width: '50%', color: '#000', fontWeight: 'bold' }}>₹{orderData?.total_amount}</Text>
                            </View>
                        </View>
                        <View style={{ marginVertical: 5, padding: 10, borderRadius: 6, backgroundColor: fBTheme.fBWhite, elevation: .7 }}>
                            <Text style={{ borderBottomWidth: .5, width: '100%', paddingVertical: 6, borderColor: fBTheme.fBPurple, color: '#000', fontWeight: 'bold' }}>Delivery Address</Text>
                            <Text style={{ color: '#000', marginTop: 6 }}>{orderData?.fullName}</Text>
                            <Text style={{ color: fBTheme.fbGray }}>{orderData?.billingAddress}</Text>
                            <Text style={{ color: '#000' }}>{orderData?.contactNo}</Text>
                        </View>
                        {orderData?.orderDetails.map((item, index) => {
                            const itemPrice = item.product_amount * item.quantity
                            return (
                                <View style={{ marginVertical: 5, padding: 10, borderRadius: 6, backgroundColor: fBTheme.fBWhite, elevation: .7 }} key={index}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: 100, height: 120, borderRadius: 6, overflow: 'hidden' }}>
                                            <Image style={{ width: '100%', height: '100%' }} source={{ uri: bookBaseUrl + item.product_cover_image }} />
                                        </View>
                                        <View style={{ marginLeft: 15 }}>
                                            <Text style={{ textTransform: 'capitalize', color: '#000', fontWeight: '500' }}>{item.product_name.length > 30 ? item.product_name.substring(0, 30) + '...' : item.product_name}</Text>
                                            <View style={{ flexDirection: 'row', marginVertical: 6 }}>
                                                <Text style={{ color: fBTheme.fbGray, width: '20%' }}>ISBN :</Text>
                                                <Text style={{ color: fBTheme.fbGray, width: '80%' }}>12548785754458</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: fBTheme.fbGray, width: '20%' }}>Price:</Text>
                                                <Text style={{ color: fBTheme.fbGray, width: '80%' }}>{'₹' + itemPrice.toFixed(2)}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: fBTheme.fbGray, width: '20%' }}>Quantity :</Text>
                                                <Text style={{ color: fBTheme.fbGray, width: '80%' }}>{item.quantity}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}

                        {corriorStatus == 1 ?
                            <View style={{ marginVertical: 5, padding: 10, borderRadius: 6, backgroundColor: fBTheme.fBWhite, elevation: .7 }}>
                                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                    <Text style={{ width: '50%', color: '#000' }}>Courier Partner:</Text>
                                    <Text style={{ width: '50%' }}>Blue Dart</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                    <Text style={{ width: '50%', color: '#000' }}>Tracking Number:</Text>
                                    <Text style={{ width: '50%' }}>0125486548652</Text>
                                </View>
                            </View> :
                            <View style={{ marginVertical: 5, padding: 10, borderRadius: 6, backgroundColor: fBTheme.fBWhite, elevation: .7 }}>
                                <Text style={{ fontWeight: 'bold', color: fBTheme.fBGreen }}>Order Preparing for Dispatch</Text>
                            </View>
                        }
                        <TouchableOpacity style={{ borderTopWidth: .5, borderBottomWidth: .5, padding: 6, paddingHorizontal: 10, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => downloadInvoice()}
                        >
                            <MaterialIcons name='picture-as-pdf' size={24} color={fBTheme.fBPurple} />
                            <Text style={{ marginHorizontal: 15, color: fBTheme.fBPurple, fontWeight: '500' }}>VIEW INVOICE</Text>
                        </TouchableOpacity>
                        {/* <CustomerSupport /> */}


                    </ScrollView>
                </View>
            ) : null}
            <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
        </>
    )
}

export default OrderDetail

const styles = StyleSheet.create({})