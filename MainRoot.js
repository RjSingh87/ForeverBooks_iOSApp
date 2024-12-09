import { StyleSheet, StatusBar, } from 'react-native'
import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// navigation //
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
// navigation //
import { apiRoot, cbseboard, fBTheme, token } from './constant';
// Screen //
import Splash from './screens/appScreen/Splash';
import FbDrawer from './screens/drawerNavigator/FbDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { addMyProduct } from './screens/reduxTookit/product/ProductSlice';
import Services from './services';
import BottomTab from './screens/common/BottomTab';

// Screen //
const StartStack = createStackNavigator()
const Drawer = createDrawerNavigator()

const MainRoot = ({ }) => {


  const dispatch = useDispatch()
  const data = useSelector(state => state.product)

  useEffect(() => {
    getPoductList();
  }, []);

  function getPoductList() {
    const payload = {
      "token": token,
      "board_id": cbseboard
    }
    Services.post(apiRoot.productList, payload)
      .then((res) => {
        if (res.status == 'success') {
          if (res.data.length) {
            let newData = res.data.map((item => {
              let selectedType = item?.productDesc != undefined ? item?.productDesc[0] : null;
              return {
                ...item,
                selectedType: selectedType
              }
            }));
            newData.map(item => {
              if (!data.length > 0) {
                dispatch(addMyProduct(item))
              }
            });
          }
        }
      })
      .catch((err) => {
        const error = err.message.slice(11)
        dispatch(addMyProduct(error))
      })
      .finally(() => {
      })
  }
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={fBTheme.fBPurple}
        translucent={false}
        networkActivityIndicatorVisible={true}
      />
      <StartStack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: fBTheme.fBPurple },
          headerTintColor: fBTheme.fBWhite,
          headerTitleStyle: {
            fontWeight: '300',
            flexWrap: 'wrap',
            fontSize: 16,
          }
        }}
      >
        <StartStack.Screen name='Splash' component={Splash} options={{ headerShown: false }} />
        <StartStack.Screen name='Home' component={DrawerRoot} options={{ headerShown: false }} />
      </StartStack.Navigator>
    </NavigationContainer>
  )
}
export default MainRoot;
const DrawerRoot = () => {
  return (
    <Drawer.Navigator drawerContent={props => <FbDrawer{...props} />}>
      <Drawer.Screen name='Forever_Books' component={BottomTab} options={{ headerShown: false }} />
    </Drawer.Navigator>
  )
}
const styles = StyleSheet.create({})