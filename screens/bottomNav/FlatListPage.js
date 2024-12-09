import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { fBTheme } from '../../constant'
import { FlatList } from 'react-native'
import { Image } from 'react-native-animatable'

const FlatListPage = () => {

  const [viewSize, setSizeView] = useState()
  const onLayout = (event) => {
    // console.log(event.nativeEvent.layout, "first")
    return setSizeView(event.nativeEvent.layout.height)
  }

  const arrayNew = Array(50).fill(0)

  const flatListData = [
    {
      "id": 1,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1678811116814-26372fcfef1b?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 2,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1731466450638-959a6f0d1514?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 3,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1664566484452-03b6f3817fdc?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 4,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1678811116814-26372fcfef1b?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 5,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1678811116814-26372fcfef1b?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 6,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 7,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1678811116814-26372fcfef1b?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 1,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1678811116814-26372fcfef1b?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 2,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1731466450638-959a6f0d1514?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 3,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1664566484452-03b6f3817fdc?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 4,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1678811116814-26372fcfef1b?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 5,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1678811116814-26372fcfef1b?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 6,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 7,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1678811116814-26372fcfef1b?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 1,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1678811116814-26372fcfef1b?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 2,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1731466450638-959a6f0d1514?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 3,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1664566484452-03b6f3817fdc?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 4,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1678811116814-26372fcfef1b?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 5,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1678811116814-26372fcfef1b?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 6,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 7,
      "name": "Naturals",
      "Image": "https://images.unsplash.com/photo-1678811116814-26372fcfef1b?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  ]

  const renderItem = (item, id) => {
    console.log(item.Image, id, "FFFF")
    return (
      <View style={{
        flex: 1,
        width: "50%", height: 200, margin: 2, borderWidth: 1, justifyContent: "center", alignItems: "center"
      }}>
        <Image style={{ width: "100%", height: 150, resizeMode: "contain" }} src={item.item?.Image} />
        <Text> {item.item?.name} </Text>
      </View>
    )
  }

  const ITEM_HEIGHTS = [50, 70, 100]; // Example heights for items

  const getItemLayout = (data, index) => {
    console.log(ITEM_HEIGHTS[index], "index????")
    // return
    const offset = ITEM_HEIGHTS.slice(0, index).reduce((sum, height) => sum + height, 0);
    console.log(offset, "ofsettt.index????")
    return {
      length: ITEM_HEIGHTS[index],
      offset,
      index,
    };
  };








  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: fBTheme.fBPurple }}>
      <View onLayout={onLayout} style={{ flex: 1, backgroundColor: fBTheme.fBLigh }}>
        {/* <Text> {`${viewSize}`} </Text> */}

        <FlatList
          numColumns={2}
          data={flatListData}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
        />



      </View>




    </SafeAreaView>
  )
}

export default FlatListPage

const styles = StyleSheet.create({})