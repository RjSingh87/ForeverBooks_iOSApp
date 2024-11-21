import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { fBTheme } from '../../constant'
import FBLogo from '../../assets/fBCircleLogo.png'


const OrderInvoice = ({navigation, route}) => {
  return (
    <View style={{flex:1, backgroundColor:fBTheme.fBLigh}}>
      <View style={{backgroundColor:fBTheme.fBPurple, height:250}}>
      <View style={{justifyContent:'center', alignItems:'center'}}>
        <Image source={FBLogo}style={styles.logoStyle}/>
        <Text style={{ fontFamily: 'Trajan Pro Bold', fontSize: 18, color: '#ffff'}}>FOREVER BOOKS</Text>
        <Text style={{fontSize:40, color:'#fff', marginVertical:10}}>₹ {route.params.TXNAMOUNT} {route.params.CURRENCY}</Text>

      </View>

        
      </View>
    </View>
  )
}

export default OrderInvoice

const styles = StyleSheet.create({
  logoStyle: {
    width: 40,
    height: 40,
    marginVertical:10
  },
})