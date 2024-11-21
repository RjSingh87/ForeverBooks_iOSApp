import { StyleSheet, Text, View, ImageBackground, Image, ScrollView, RefreshControl, Share, Alert} from 'react-native'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Drawer } from 'react-native-paper'

import { MyData } from '../../Store'
import { fBTheme, mainURL, token } from '../../constant'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfileData } from '../reduxTookit/address/ProfileSlice'

const FbDrawer = ({ navigation }) => {
  
  const { loginStatus, logOut, addUserData } = useContext(MyData)
  const userprofileData = useSelector(state => state.profileData.data)
  const [active, setActive] = React.useState('');
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    getCustomerProfileData()
  }, []);

  function getCustomerProfileData() {
    const dataPayload = {
      "customer_id": addUserData?.customer_id,
      "token": token
    }
    dispatch(fetchProfileData(dataPayload));
    setLoading(false);
  };
  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'App link',
        message: 'Please install this app, AppLink :https://play.google.com/store/apps/details?id=com.foreverbooksapp&hl=en_US',
        sharedAction: 'sharedAction'
      });
      if (result.action === Share.sharedAction) {
        // console.log(Share.sharedAction)
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert('Info!', error.message);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => {
            setLoading(true);
            getCustomerProfileData();
          }}
          tintColor={fBTheme.fBPurple}
          title='Refresh'
        />
      }>
      <View style={{ width: '100%', height: 118 }}>
        <ImageBackground
          source={require('../../assets/bgSquare.png')}
          style={styles.img}>

          <View
            style={{
              height: 110,
              width: 110,
              borderRadius: 100,
              backgroundColor: fBTheme.fBWhite,
              borderColor: fBTheme.fBPurple,
              borderWidth: 1,
              padding: 8,
              position: 'absolute',
              bottom: -50,
              elevation: 0.9
            }}>

            {loginStatus.isLogin ?
              <Image style={{
                width: '100%',
                height: '100%',
                borderRadius: 100,
              }} source={{ uri: mainURL + userprofileData?.profile_path + userprofileData?.profile_image }} />
              :
              <Image style={{
                width: '100%',
                height: '100%',
                borderRadius: 100,
              }} source={require('../../assets/fBCircleLogo.png')}/>
            }
          </View>
        </ImageBackground>
      </View>
      {loginStatus.isLogin ?
        <Text style={{ paddingVertical: 8, color: '#000', textAlign: 'center', marginTop: 55, fontWeight: '500', textTransform: 'capitalize' }}>{userprofileData?.firstname + ' ' + userprofileData?.lastname}</Text> :
        <Text style={{ paddingVertical: 8, textAlign: 'center', marginTop: 55, fontFamily: 'Trajan Pro Bold', fontSize: 18, color: fBTheme.fBPurple }}><Text style={{ color: 'red' }}>FOREVER</Text> BOOKS</Text>
      }
      <View style={{flex: 1, paddingVertical: 20}}>
        <Drawer.Section
          showDivider={false}
        >
          <Drawer.Item
            label="Dashboard"
            icon={({ size }) => <Icon color={fBTheme.fBPurple} size={size} name='home' />}
            active={active === 'Dashboard'}
            onPress={() => navigation.navigate('Dashboard')}
          />
          <Drawer.Item
            label="ContactUs"
            icon={({ size }) => <MaterialIcons color={fBTheme.fBPurple} size={size} name='call' />}
            active={active === 'Sign Out'}
            onPress={() => navigation.navigate('ContactUs')}
          />
          <Drawer.Item
            label="Share App"
            icon={({ size }) => <MaterialIcons color={fBTheme.fBPurple} size={size} name='share' />}
            active={active === 'Share App'}
            onPress={() => { onShare(); navigation.closeDrawer() }}/>

          {loginStatus.isLogin ?
            <Drawer.Item
              label="Account"
              icon={({ size }) => <Icon color={fBTheme.fBPurple} size={size} name='user' />}
              active={active === 'Profile'}
              onPress={() => navigation.navigate('Profile')}
            /> :
            <Drawer.Item
              label="Login/Signup"
              icon={({ size }) => <MaterialIcons color={fBTheme.fBPurple} size={size} name='login'/>}
              active={active === 'Login'}
              onPress={() => navigation.navigate('Login')}
            />
          }

          {loginStatus.isLogin &&
            <>
              <Drawer.Item
                label="Wish List"
                icon={({ size }) => <Ionicons color={fBTheme.fBPurple} size={size} name='heart-outline'/>}
                active={active === 'WishList'}
                onPress={() => navigation.navigate('WishList')}
              />
              <Drawer.Item
                label="Sign Out"
                icon={({ size }) => <MaterialIcons color={fBTheme.fBPurple} size={size} name='logout'/>}
                active={active === 'Sign Out'}
                onPress={(() => { logOut() })}
              />
            </>
          }
        </Drawer.Section>
      </View>
      <View style={{ height: 20, borderTopWidth: 1, borderColor: fBTheme.fBLigh, width: '100%', justifyContent: 'center', alignItems: 'center', paddingLeft: 10 }}>
        <Text style={{color: fBTheme.fBPurple, fontSize: 12,}}>V: 3.1</Text>
      </View>
    </View>
  )
}

export default FbDrawer
const styles = StyleSheet.create({
  img: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',

  }
})