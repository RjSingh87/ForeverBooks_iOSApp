import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Lottie from 'lottie-react-native';
import { fBTheme } from '../../constant';


const ICSE = () => {
  return (
    <View style={styles.animationContainer}>
    <Lottie source={require('../../assets/data-not-found.json')}
      autoPlay loop
      style={styles.animationStyle}
    />
    <Text style={{ fontSize: 18, fontWeight: 700, color: fBTheme.fBPurple, textAlign: 'center' }}>Data not found</Text>

  </View>
  )
}

export default ICSE

const styles = StyleSheet.create({
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center'

  },
  animationStyle: {
    width: 200,
    height: 200,
    alignSelf: 'center'
  }
})