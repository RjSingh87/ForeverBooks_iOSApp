import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Cart from '../bottomNav/Cart'
import CheckOutScreen from '../bottomNav/CheckOutScreen'
import { fBTheme } from '../../constant'
import AddNewAddress from '../bottomNav/AddNewAddress'
import PaymentOptions from '../bottomNav/PaymentOptions'
import OrderInvoice from '../bottomNav/OrderInvoice'
import Dashboard from '../bottomNav/Dashboard'
import MyOrder from '../bottomNav/MyOrder'
const CartNavigation = createStackNavigator()

const CartStack = () => {
  return (
    <CartNavigation.Navigator
    screenOptions={{
      headerStyle : {backgroundColor:fBTheme.fBPurple, shadowColor:fBTheme.fBLigh},
      headerTintColor: fBTheme.fBLigh,
      headerTitleStyle: {
        fontWeight: '300',
        flexWrap: 'wrap',
        fontSize: 16,
      }
    }}
    >
      <CartNavigation.Screen
          name='Cart'
          component={Cart}
          options={{headerShown:false}}
      />


      <CartNavigation.Screen
          name='CheckOutScreen'
          component={CheckOutScreen}
          options={({})=>
          ({
          title:'Order Summary',
          })}
      
      />
     
       <CartNavigation.Screen
          name='AddNewAddress'
          component={AddNewAddress}
          options={({})=>
          ({
          title:'Add New Address',
          })}
      
      />
       <CartNavigation.Screen
          name='PaymentOptions'
          component={PaymentOptions}
          options={({})=>
          ({
          title:'Payment',
          })}
      
      />
      <CartNavigation.Screen
          name='MyOrder'
          component={MyOrder}
          options={({})=>
          ({
          title:'My Order',
          })}
      
      />
      <CartNavigation.Screen
          name='OrderInvoice'
          component={OrderInvoice}
          options={({})=>
          ({
          headerShown:false,
          title:'Order Invoice',
          })}
      
      />
    
    </CartNavigation.Navigator>
  )
}

export default CartStack
const styles = StyleSheet.create({})