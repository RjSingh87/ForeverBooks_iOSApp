import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import React, { useState, useCallback, useEffect, useContext } from 'react';
import Lottie from 'lottie-react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { apiRoot, fBTheme, token } from '../../constant';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCardList } from '../reduxTookit/cart/CartListSlice';
import { MyData } from '../../Store';
import EmptyView from '../common/EmptyView';
import CheckInternet from '../appScreen/CheckInternet';
import services from '../../services';
import Loader from '../common/Loader';

const MyOrder = ({ navigation }) => {
    const [isLoading, setLoading] = useState(false)
    const { addUserData, uniqueID } = useContext(MyData);
    const [isConnected, setIsConnected] = useState(false)
    const [orderList, setOrderList] = useState({ state: false, data: {} })

    useEffect(() => {
        getOrderList()
    }, []);


    function getOrderList() {
        setLoading(true);
        const orderPlaylist = {
            "customer_id": addUserData?.customer_id,
            "token": token
        }
        services.post(apiRoot.getOrderList, orderPlaylist)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false);
                    setOrderList((prev) => {
                        return { ...prev, status: true, data: res.data }
                    })
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    function viewOrderDetails(item, orderDate, orderTime) {
        navigation.navigate('OrderDetail', { data: item, url: orderList.data.img_url, orderDate: orderDate, orderTime: orderTime })
    }
    return (
        <>
            {isConnected == true ? (
                <>
                    {!isLoading == true ?
                        <View style={{ flex: 1, backgroundColor: fBTheme.fBLigh, padding: 10, }}>
                            <ScrollView
                                contentContainerStyle={{ flexGrow: 1, justifyContent: orderList.data?.orders?.length > 0 ? null : 'center' }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isLoading}
                                        onRefresh={() => {
                                            setLoading(true);
                                            getOrderList()
                                        }}
                                        tintColor={fBTheme.fBPurple}
                                        title='Refresh'
                                    />
                                }
                            >
                                {orderList?.data?.orders?.map((item, index) => {
                                    const date = new Date(item.order_date);
                                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                    const orderDate = date.getDate() < 9 ? "0" + date.getDate() : date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
                                    const weekday = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
                                    const day = weekday[date.getUTCDay()]
                                    const hours = date.getUTCHours() < 9 ? "0" + date.getUTCHours() : date.getUTCHours()
                                    const minute = date.getUTCMinutes() < 9 ? "0" + date.getUTCMinutes() : date.getUTCMinutes()
                                    const orderTime = day + " " + hours + ":" + minute
                                    let totalQty = 0
                                    item.orderDetails.map((item, index) => {
                                        totalQty += item.quantity
                                    })
                                    return (
                                        <TouchableOpacity style={{
                                            marginVertical: 5, flexDirection: 'row', padding: 10, borderRadius: 6,
                                            backgroundColor: fBTheme.fBWhite, elevation: .7
                                        }}
                                            onPress={() => { viewOrderDetails(item, orderDate, orderTime, totalQty) }}
                                            key={item.order_no}>

                                            {/* <View style={{width: 100, height: 120, borderRadius: 6, overflow: 'hidden'}}>
                                        <Image style={{width: '100%', height: '100%'}} source={{uri: orderList.data?.img_url + item.orderDetails[0].product_cover_image}}/>
                                    </View> */}

                                            <View style={{ paddingLeft: 15, flex: 1, flexDirection: "row" }}>
                                                <View style={{ flex: 1, widtH: '100%', }}>
                                                    <Text style={{ color: 'black', marginBottom: 4, fontWeight: 'bold' }}>Order No: {item.order_no}</Text>
                                                    <Text style={{ color: fBTheme.fBPurple, fontSize: 12, marginVertical: 4 }}>Total Items: {totalQty}</Text>

                                                    {/* {item.orderDetails.length>1 &&
                                            <Text style={{color: fBTheme.fBPurple, fontSize: 12, marginVertical:4}}>and {item.orderDetails.length-1} More {totalQty>1?"Items":"Item"}</Text>
                                            } */}

                                                    <Text style={{ color: fBTheme.fbGray, textTransform: 'capitalize' }}>{orderDate}, {orderTime}</Text>
                                                    {/* <Text style={{ fontSize: 14, color: '#000', textTransform: 'capitalize' }}>{orderTime}</Text>*/}
                                                    {/* <Text style={{ fontSize: 18, color: 'black', textTransform: 'capitalize', marginVertical: 6}}>Amount: ₹{item.total_amount}</Text> */}

                                                </View>
                                                <View style={{ width: 80, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: fBTheme.fBLigh }}>
                                                    <Text style={{ fontSize: 18, color: fBTheme.fBGreen, textTransform: 'capitalize', marginVertical: 6 }}>₹{item.total_amount}</Text>
                                                </View>
                                                <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                                                    <MaterialIcons name='chevron-right' size={24} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                                {orderList.data?.orders?.length > 0 ?
                                    <View style={{ marginVertical: 0, padding: 10, borderRadius: 6 }}>
                                        <Text style={{ textAlign: 'center', color: fBTheme.fBRed }}>No more Orders</Text>
                                    </View> :
                                    <EmptyView mainMsg={'You have placed no order.'} />
                                }
                            </ScrollView>
                        </View> :
                        <Loader />


                    }
                </>

            ) : null}
            <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
        </>
    )
}
export default MyOrder
const styles = StyleSheet.create({
    animationStyle: {
        width: 200,
        height: 200,
        alignSelf: 'center'
    }
})