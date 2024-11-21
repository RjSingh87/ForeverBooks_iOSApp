import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { fBTheme } from '../../constant';
import Lottie from 'lottie-react-native';
import { MyData } from '../../Store';


const EmptyView = ({onpressFunction, mainMsg, subMsg, btnName, iconName, addBtn}) => {
  const {logOut} = useContext(MyData)
  
  return (
    <View style={{justifyContent: 'center', alignItems: 'center',}}>
    {addBtn=="logOut"?
    <Lottie source={require(`../../assets/sad.json`)}
        autoPlay loop
        style={styles.animationStyle}
        />:
        <Lottie source={require(`../../assets/shoppingBag.json`)}
        autoPlay loop
        style={styles.animationStyle}
        />
    }
    <Text style={{ fontWeight: '700', color: 'black', fontSize: 16}}>{mainMsg}</Text>
    <Text style={{color:fBTheme.fbGray}}>{subMsg}</Text>
    {btnName == undefined ?
    null:
    <TouchableOpacity style={{padding: 10, marginVertical: 20, borderRadius: 4, backgroundColor: fBTheme.fBPurple,}}
      onPress={onpressFunction}
    >
      <Text style={{ color: fBTheme.fBWhite }}>{btnName}</Text>
    </TouchableOpacity>
    }
    {addBtn=="logOut" &&
     <TouchableOpacity style={{width:100, backgroundColor:fBTheme.fBPurple, padding:10, borderRadius:4}}
      onPress={()=>logOut()}
     >
       <Text style={{textAlign:'center', color:fBTheme.fBWhite}}>Re-Login</Text>
     </TouchableOpacity>
    }
  </View>
  )
}
export default EmptyView
const styles = StyleSheet.create({
    animationStyle: {
        width: 200,
        height: 200,
        alignSelf: 'center',
      }
})