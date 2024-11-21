import { StyleSheet, Text, View, Button, Dimensions } from 'react-native'
import React, {useContext} from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from '../LoginScreen'
import CreateNewAccount from './CreateNewAccount'
import Profile from '../bottomNav/Profile'
import { fBTheme } from '../../constant'
import EditProfile from '../bottomNav/EditProfile'
import { MyData } from '../../Store'
import AddAddress from '../bottomNav/AddAddress'
import AddNewAddress from '../bottomNav/AddNewAddress'
import EditAddress from '../bottomNav/EditAddress'
import WishList from '../bottomNav/WishList'
import MyOrder from '../bottomNav/MyOrder'
import OrderDetail from '../bottomNav/OrderDetail'
import PdfViewer from '../bottomNav/PdfViewer'

const ProfStack = createStackNavigator()

const ProfileStack = ({route}) => {
  const {loginStatus, logOut} = useContext(MyData)
  return(
    <ProfStack.Navigator
      screenOptions={{
        headerStyle : {backgroundColor:fBTheme.fBPurple, shadowColor:fBTheme.fBLigh},
        headerTintColor: fBTheme.fBLigh,
        headerTitleStyle: {
          fontWeight: '300',
          flexWrap: 'wrap',
          fontSize: 16,
        }
      }}>
        {loginStatus.isLogin?
          <ProfStack.Screen
            name='Profile'
            component={Profile}
            options={({route}) => ({
              headerShown:false,
            })}
            
          />:
          <ProfStack.Screen
            name='Login'
            
            component={LoginScreen}
            options={({route})=>({
              headerShown:false,
              })}
            
          />
        }
        <ProfStack.Screen
          name='Account'
          component={CreateNewAccount}
          options={{headerShown:true, title:'Create New Account'}}
        />
        <ProfStack.Screen
          name='EditProfile'
          component={EditProfile}
          options={{headerShown:true, title:'Edit Profile'}}
        />
        <ProfStack.Screen
          name='WishList'
          component={WishList}
          options={{headerShown:true, title:'My Wish List'}}
        />
        <ProfStack.Screen
          name='MyOrders'
          component={MyOrder}
          options={{headerShown:true, title:'My Orders'}}
        />
        <ProfStack.Screen
          name='OrderDetail'
          component={OrderDetail}
          options={{headerShown:true, title:'Order Details'}}
        />
        <ProfStack.Screen
          name='PdfViewer'
          component={PdfViewer}
          options={{headerShown:true, title:'Invoice'}}
        />
        <ProfStack.Screen
          name='AddAddres'
          component={AddAddress}
          // options={{headerShown:true, title:'Add Address'}}
          options={({})=>({
            tabBarBadge:3,
            title:'Add Address',
            // headerRight: () => (
            //   <AntDesign name="shoppingcart" color={fBTheme.fBWhite} size={24} marginRight={20}/>
            // ),
          })}
        />
        <ProfStack.Screen
          name='AddNewAddress'
          component={AddNewAddress}
          // options={{headerShown:true, title:'Add Address'}}
          options={({})=>({
            tabBarBadge:3,
            title:'Add New Address',
            // headerRight: () => (
            //   <AntDesign name="shoppingcart" color={fBTheme.fBWhite} size={24} marginRight={20}/>
            // ),
          })}
        />
        <ProfStack.Screen
          name='EditAddress'
          component={EditAddress}
          // options={{headerShown:true, title:'Add Address'}}
          options={({})=>({
            tabBarBadge:3,
            title:'Edit Address',
            // headerRight: () => (
            //   <AntDesign name="shoppingcart" color={fBTheme.fBWhite} size={24} marginRight={20}/>
            // ),
          })}
        />
    </ProfStack.Navigator>
    
  )
}

export default ProfileStack

const styles = StyleSheet.create({})