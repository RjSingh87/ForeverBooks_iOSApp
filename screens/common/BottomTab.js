import { StyleSheet, Text, View, Keyboard } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useDispatch, useSelector } from 'react-redux'
import { MyData } from '../../Store'
import { fetchWishList } from '../reduxTookit/wishList/WishListSlice'
import { fBTheme, token } from '../../constant'
import CartStack from '../appScreen/CartStack'
import WishList from '../bottomNav/WishList'
import ProfileStack from '../appScreen/ProfileStack'
import HomeNavScreen from '../appScreen/HomeNavScreen'


import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { fetchCardList } from '../reduxTookit/cart/CartListSlice'


const Bottom = createBottomTabNavigator()

const BottomTab = ({ navigation }) => {
  const dispatch = useDispatch()
  const { loginStatus, logOut } = useContext(MyData)
  const { addUserData, uniqueID } = useContext(MyData);
  const cartData = useSelector(state => state.cartList.data)
  const userWishListData = useSelector(state => state.wishList.data)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };

  }, []);

  useEffect(() => {
    getUserCartList()
    getWishList();

  }, [loginStatus])

  async function getUserCartList() {
    const cartListPayload = {
      "customer_id": addUserData?.customer_id,
      "token": token,
    }
    dispatch(fetchCardList(cartListPayload));
  }

  const getWishList = () => {
    const wishListPayload = {
      "customer_id": addUserData?.customer_id,
      "token": token,
    }
    dispatch(fetchWishList(wishListPayload))
  }

  let tabdisplay = null
  if (isKeyboardVisible == true) {
    tabdisplay = 'none'
  }

  return (
    <Bottom.Navigator screenOptions={{
      tabBarShowLabel: false,
      tabBarStyle: { backgroundColor: fBTheme.fBPurple, display: tabdisplay },
      tabBarInactiveTintColor: fBTheme.fBLigh,
    }}

    >
      <Bottom.Screen
        name='Home'
        component={HomeNavScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={size} />
          ),
          headerShown: false,
        })}

      />
      <Bottom.Screen
        name='TabAccount'
        component={ProfileStack}
        options={({ route }) => ({
          headerStyle: { backgroundColor: fBTheme.fBPurple, },
          headerTitleStyle: { color: fBTheme.fBWhite },
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name={loginStatus.isLogin ? "user" : "login"} color={color} size={size} />
          ),
        })}
      />
      <Bottom.Screen
        name='WishList'
        component={WishList}
        options={({ route }) => ({
          tabBarBadge: userWishListData.length == 0 ? null : userWishListData.length,
          headerStyle: {
            backgroundColor: fBTheme.fBPurple,
          },
          headerTitleStyle: {
            color: fBTheme.fBWhite
          },
          headerShown: false,
          headerLeft: () => (
            <Ionicons name='ios-menu' size={35} color={fBTheme.fBWhite}
              onPress={() => { navigation.openDrawer() }}></Ionicons>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        })}
      />
      <Bottom.Screen
        name='Cart_Nav'
        component={CartStack}
        options={({ route }) => ({
          tabBarBadge: cartData.length == 0 ? null : cartData.length,
          headerStyle: {
            backgroundColor: fBTheme.fBPurple,
          },
          headerTitleStyle: { color: fBTheme.fBWhite },
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="shoppingcart" color={color} size={size} />
          ),
        })}
      />
    </Bottom.Navigator>
  )
}

export default BottomTab
const styles = StyleSheet.create({})