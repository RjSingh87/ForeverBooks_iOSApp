import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity} from 'react-native'
import React,{useContext, useState} from 'react'
import { fBTheme } from '../../constant'
import { MyData } from '../../Store';
import Feather from 'react-native-vector-icons/Feather';


const CustomInput = ({lable, value, onChangeText, placeholder, type, icon, keyboardType, defaultValue, maxLength, editable, selectTextOnFocus}) => {
    const {errorStatus} = useContext(MyData)
       return (
    <>
        <View style={{marginBottom:20}}>
            {lable!==undefined?
            <Text style={styles.lableStyle}>{lable}</Text>:
            null
            }
            <View style={styles.InputCotainer}>
                <TextInput
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    placeholderTextColor={fBTheme.fbGray}
                    maxLength={maxLength}
                    secureTextEntry={type=='password'?true:false}
                    keyboardType={keyboardType?keyboardType:'default'}
                    onChangeText={onChangeText}
                    style={styles.inputBox}
                    editable={editable=='false'?false:true}
                    selectTextOnFocus={selectTextOnFocus=='false'?false:true}
                />
                <Feather name={icon} size={20}/>
            </View>
            {/* {errorStatus.status&&
             <Text style={styles.errorText}>{errorStatus.msg}</Text>
            } */}
            {/* {(value == '' && errorStatus) &&
                <Text style={styles.errorText}>{errorStatus.msg}</Text>
            } */}
        </View>
    </>
  )
}

export default CustomInput

const styles = StyleSheet.create({
    lableStyle:{
        paddingBottom:8, fontWeight:'bold', color:'#000'
    },
    InputCotainer:{
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        height:45,
        overflow:'hidden',
        borderWidth:.7,
        borderRadius:4,
        paddingHorizontal:6,
        borderColor:fBTheme.fBPurple,
        alignSelf:'center',
        // marginBottom:20
    },
    errorText:{
        fontSize:12,
        color:'red'
    },
    inputBox:{
        flex:1,
        color:'#000'
    },
    varifyBtn:{
        backgroundColor:fBTheme.fBPurple,
        height:25,
        padding:4,
        borderRadius:4
    }
})