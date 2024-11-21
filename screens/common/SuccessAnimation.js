import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Lottie from 'lottie-react-native';


const SuccessAnimation = () => {
    return (
        <View style={styles.animationContainer}>
            <Lottie source={require('../../assets/myAnimation.json')}
                autoPlay loop
                style={styles.animationStyle}
            />
        </View>
    )
}

export default SuccessAnimation

const styles = StyleSheet.create({
    animationContainer:{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        position:'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0,
        justifyContent:'center',
        alignItems:'center'

    },
    animationStyle:{
        width:200,
        height:200,
        alignSelf:'center'
    }
})