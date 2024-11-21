import { StyleSheet, Text, View, ImageBackground,  Dimensions,  Platform, StatusBar, Image, TouchableOpacity} from 'react-native'
import React, {useEffect, useState} from 'react'
import * as Animatable from 'react-native-animatable';

const {height, width} = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
import { fBTheme } from '../../constant';

const Splash = ({navigation}) => {
   useEffect(()=>{
      setTimeout(()=>{
            navigation.navigate('Home')
        }, 3000)
        const goBack = navigation.addListener('focus', () => {
          setTimeout(()=>{
            navigation.navigate('Home')
        }, 2000)
        });
        return goBack
    },[]);

  return (
    <SafeAreaView style={styles.androidArea}>
        <View style={{flex:1, position:'relative', justifyContent:'center', alignItems:'center'}}>
          <View style={{position:'absolute', left:0, right:0, top:0, bottom:0, backgroundColor:fBTheme.fBPurple}}>
            <Image source={require('../../assets/splashBG-1.webp')} style={{width:'100%', height:'100%'}}></Image>
          </View>
          <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}>

            <Animatable.Image
                  animation="fadeInUp"
                  delay={600}
                  source={require('../../assets/splashBG-2.webp')}
                  style={{
                      width:'100%',
                      height:'100%',
                      resizeMode:'contain',
                  }}
              />
              
          </View>
        </View>
    </SafeAreaView>
  )
}

export default Splash

const styles = StyleSheet.create({
  androidArea:{
    flex:1,
    backgroundColor:fBTheme.fBPurple,
    height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
  
  img:{
      height: (height),
      width: width,
      justifyContent: 'center',
      alignItems: 'center',
    },
    welComeText:{
        fontSize:20,
        fontWeight:'bold',
        color:'#fff'

    },
    centerImg:{
      width:'100%',
      height:'100%',
      borderWidth:1,
      borderColor:'red'
    }

})