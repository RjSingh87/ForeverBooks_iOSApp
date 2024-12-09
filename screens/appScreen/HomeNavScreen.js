import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { nonVisibleTabRouts, fBTheme } from '../../constant';
import Icon2 from 'react-native-vector-icons/Ionicons'
import Ionicons from 'react-native-vector-icons/Ionicons';



import CBSE from './CBSE';
import Dashboard from '../bottomNav/Dashboard';
import ICSE from './ICSE';
import BookDetail from './BookDetail';
import LoginScreen from '../LoginScreen';
import Profile from '../bottomNav/Profile';
import CreateNewAccount from './CreateNewAccount';
import EditProfile from '../bottomNav/EditProfile';
import CheckOutScreen from '../bottomNav/CheckOutScreen';
import PaymentOptions from '../bottomNav/PaymentOptions';
import ForgotPassword from '../ForgotPassword';
import VerifyYourMail from '../VerifyYourMail';
import ResetPassword from '../ResetPassword';
import AddAddress from '../bottomNav/AddAddress';
import CustomerSupport from '../bottomNav/CustomerSupport';
import Cart from '../bottomNav/Cart';
import FlatListPage from '../bottomNav/FlatListPage';

const HomeStack = createStackNavigator();
const HomeNavScreen = ({ navigation, route }) => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: fBTheme.fBPurple },
        headerTintColor: fBTheme.fBLigh,
        headerTitleStyle: {
          fontWeight: '500',
          flexWrap: 'wrap',
          fontSize: 18,
        }
      }}
    >
      <HomeStack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
      <HomeStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: true, title: 'Forgot Password' }} />
      <HomeStack.Screen name="VarifyYourMail" component={VerifyYourMail} options={{ headerShown: true, title: 'Verify Your Email' }} />
      <HomeStack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: true, title: 'Reset Your Password' }} />
      <HomeStack.Screen name="Account" component={CreateNewAccount} options={{ headerShown: true }} />
      <HomeStack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <HomeStack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: true }} />
      <HomeStack.Screen name="CBSE" component={CBSE} options={{ headerShown: false, title: 'Our Product' }} />
      <HomeStack.Screen name="ICSE" component={ICSE} />
      <HomeStack.Screen name="BookDetail" component={BookDetail} options={{ title: 'Book Detail' }} />
      <HomeStack.Screen name="CheckOutScreen" component={CheckOutScreen} options={{ title: 'Order Summary' }} />
      <HomeStack.Screen name="PaymentOptions" component={PaymentOptions} options={{ title: 'Payment' }} />
      <HomeStack.Screen name="ContactUs" component={CustomerSupport} options={{ title: 'Contact Us' }} />
      <HomeStack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
      <HomeStack.Screen name="FlatListPage" component={FlatListPage} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  )
}
export default HomeNavScreen
const styles = StyleSheet.create({})