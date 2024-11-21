import { StyleSheet, Text, View, ActivityIndicator} from 'react-native'
import React from 'react'
import { fBTheme } from '../../constant'
import Lottie from 'lottie-react-native';


const Loader = () => {
  return (
    // <View style={{flex:1,justifyContent:'center',alignItems:'center', backgroundColor:fBTheme.fBLigh, }}>
    //     <ActivityIndicator size="large" color={fBTheme.fBPurple}/>
    //    <Text style={{color:fBTheme.fBPurple}}>Loding...</Text>
    // </View>

    <View style={styles.mainContainer}>
      <Lottie source={require('../../assets/dataLoading.json')}
        autoPlay loop
        style={styles.animationStyle}
      />
    <Text style={{color: fBTheme.fBPurple, textAlign: 'center', marginTop:20}}>Loading...</Text>
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({
  mainContainer:{
    flex:1, justifyContent:'center',alignItems:'center',
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
    position:'absolute', top:0, bottom:0, left:0, right:0 ,
    zIndex:999
  },
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center'

  },
  animationStyle: {
    width: 150,
    height: 150,
    alignSelf: 'center'
  }
})