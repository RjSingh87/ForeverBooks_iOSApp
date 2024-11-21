import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { fBTheme } from '../../constant'
import * as Animatable from 'react-native-animatable';
import call from 'react-native-phone-call';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomerSupport = () => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

function trigerCall(){
  const args = {
    number: '01143585858', 
    prompt: false,
    skipCanOpen: true
  }
    call(args).catch(console.error)
  }
  return (
    <View style={{height:'100%', backgroundColor:fBTheme.fBPurple,}}>
    <Animatable.View
      animation="fadeInDown"
      delay={600}
      style={{flex:1,}}>
      <Image source={require('../../assets/Contact.png')} style={{width:'100%', height:'100%',}} resizeMode = 'contain'></Image>
    </Animatable.View>
      <View style={{padding:10, width:'100%'}}>
      <Text style={{textAlign:'center', fontSize:18, fontWeight:'bold', color:fBTheme.fBWhite, marginBottom:10}}>Contact Us</Text>
        <Text style={{textAlign:'center', color:fBTheme.fBWhite}}>If you have any questions about our products or services, please call one of our numbers or send us an email. We welcome your suggestions to and feedback.</Text>
          {/* <Text style={{textAlign:'center', color:fBTheme.fbGray, fontSize:18, fontWeight:'500'}}>Have any queries?</Text>*/}
          {/* <Text style={{textAlign:'center', color:fBTheme.fBWhite, marginVertical:6, marginVertical:30, fontSize:16,}}>Please contact with us:</Text> */}
      </View>
      <View style={{flex:1, justifyContent:'center'}}>
      <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
      <View style={{width:50, height:50, borderRadius:50, marginRight:10}}>
        <Image source={require('../../assets/fBCircleLogo.png')} style={{width:'100%', height:'100%'}}></Image>
      </View>
      <Text style={{  paddingVertical: 8, textAlign: 'center', fontFamily: 'Trajan Pro Bold', fontSize: 18, color:fBTheme.fBWhite}}><Text style={{color:fBTheme.fBWhite}}>FOREVER</Text> BOOKS</Text>

      </View>
      <Text style={{color:fBTheme.fBWhite, textAlign:'center', marginTop:10}}>4583/15, Daryaganj, New Delhi-110002 (INDIA)</Text>
      <TouchableOpacity
      onPress={trigerCall}
      style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
      <Ionicons name="call" size={20} color={fBTheme.fBWhite} style={{marginHorizontal:10}}/>
      <Text style={{color:fBTheme.fBWhite, textAlign:'center', fontSize:20, fontWeight:'bold', marginVertical:6}}>+91-11-43585858</Text>

      </TouchableOpacity>
          <Text style={{color:fBTheme.fBWhite, textAlign:'center',}}>export@foreverbooks.co.in</Text>
          <Text style={{color:fBTheme.fBWhite, textAlign:'center',}}>ecommerce@foreverbooks.co.in</Text>
          <Text style={{color:fBTheme.fBWhite, textAlign:'center',}}>editorial@foreverbooks.co.in</Text>
          <Text style={{color:fBTheme.fBWhite, textAlign:'center',}}>specimen@foreverbooks.co.in</Text>
      </View>
    </View>
  )
}
export default CustomerSupport
const styles = StyleSheet.create({})