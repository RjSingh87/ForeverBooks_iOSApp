import { StyleSheet, Text, View,TouchableOpacity, Alert } from 'react-native'
import React,{useContext} from 'react'
import { fBTheme } from '../../constant';
import { MyData } from '../../Store';


const ChackoutLayout = ({navigation, total, items, btnName, mrpTotal, active, address, productID, fromCart, singProdCartId, quantity}) => {
   const { loginStatus} = useContext(MyData);
   function proceedtoPay(){
    if(address==undefined){
      Alert.alert("Info!","Please select your delivery address.")
    }else{
      navigation.navigate('PaymentOptions',{address:address, productID:productID, fromCart:fromCart, singProdCartId, quantity})
    }
  }
    function varifyOrder() {
        if (loginStatus.isLogin == true) {
          navigation.navigate('CheckOutScreen', {data:items, total:total, mrpTotal:mrpTotal, productID:productID, fromCart:fromCart })
        } else {
          navigation.navigate('Login')
        }
      }
  return (
    <View style={styles.chackoutContainer}>
        <View style={styles.detailBox}>
            <Text style={{color:fBTheme.fbGray}}>{items>1?'Items: '+items:'Item: '+items}</Text>
            <Text style={styles.totalAmount}>Total: {'₹' + total}</Text>
        </View>
        <TouchableOpacity style={styles.checkOutBtn}
        disabled={active?true:false}
          onPress={()=>btnName=="Continue"?proceedtoPay()
          :
          varifyOrder()
            // () => navigation.navigate('CheckOutScreen')
            }>
            <View style={styles.btnInner}>
            <Text style={styles.btnFont}>{btnName}</Text>
            </View>
          </TouchableOpacity>
      </View>
  )
}
export default ChackoutLayout

const styles = StyleSheet.create({
    chackoutContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: fBTheme.fBWhite,
        padding: 20,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        height:80
    },
    detailBox:{
        width:'50%',
        justifyContent:'center',
        alignItems:'center'
    },
    totalAmount:{
        marginTop: 4, fontWeight:700, color:'#000', fontSize:18
    },
    checkOutBtn:{
        width: '50%', justifyContent: 'center', alignItems: 'center',
    },
    btnFont:{
        textAlign: 'center', fontWeight: 'bold', color: fBTheme.fBWhite
    },
    btnInner:{
        padding: 10, width: 150, borderRadius: 6, backgroundColor: fBTheme.fBPurple

    }

})