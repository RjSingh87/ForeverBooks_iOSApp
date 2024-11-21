import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import React, {useEffect} from 'react'
import { fBTheme } from '../../constant';
import Lottie from 'lottie-react-native';
import NetInfo from "@react-native-community/netinfo";
import Modal from "react-native-modal";

const CheckInternet = ({isConnected, setIsConnected}) => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state =>{
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      setIsConnected(state.isConnected)
    });
    return()=>{
      unsubscribe();
    }
  }, [isConnected])

  // const checkConnection=()=>{
  //   NetInfo.fetch().then(state => {
  //     console.log("Connection type", state.type);
  //     console.log("Is connected?", state.isConnected);
  //     setIsConnected(state.isConnected)
  //   });
  // }
 
  return (
    <>
    {/* {isConnected==true?(null):
    <View style={{ flex: 1, backgroundColor: fBTheme.fBLigh, justifyContent: 'center', alignItems: 'center',}}>
      <Lottie source={require(`../../assets/noInternet.json`)}
        autoPlay loop
        style={styles.animationStyle}
      />
      <Text style={{ fontWeight: '700', color: 'black', fontSize: 16, marginBottom:20 }}>No Internet Connection</Text>
      <Text style={{color:fBTheme.fbGray}}>Please check your internet connectivity and try again</Text>
    </View>
    }
     */}
     {isConnected?null:
        (
            <Modal
                isVisible={!isConnected}
                animationInTiming={300}
                animationOutTiming={300}
                style={{width: '100%', margin: 0}}
            >
                <View style={{flex: 1, backgroundColor: fBTheme.fBPurple, justifyContent: 'center', alignItems: 'center'}}>
                    <Lottie source={require(`../../assets/noInternet.json`)}
                        autoPlay loop
                        style={styles.animationStyle}/>
                    <Text style={{ fontWeight: '700', color: fBTheme.fBWhite, fontSize: 16, marginBottom: 10 }}>No Internet Connection</Text>
                    <Text style={{ color: fBTheme.fBWhite }}>Please check your internet connectivity and try again</Text>
                </View>
            </Modal>
        )}
    </>
  )
}

export default CheckInternet
const styles = StyleSheet.create({
  animationStyle: {
    width: 150,
    height: 150,
    alignSelf: 'center'
  }
})