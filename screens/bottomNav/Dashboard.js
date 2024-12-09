import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, FlatList, ScrollView, Platform, Alert } from 'react-native';
import React, { useState, useEffect, useContext, useRef } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FBLogo from '../../assets/fBCircleLogo.png'
import CBSE from '../../assets/CBSE.png';
import ICSE from '../../assets/ICSE.png'
import { apiRoot, fBTheme, token } from '../../constant';
import CheckInternet from '../appScreen/CheckInternet';
import services from '../../services';
import Loader from '../common/Loader';
import { MyData } from '../../Store';
import { useSelector } from 'react-redux';
import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
const { height, width } = Dimensions.get('window');

const Dashboard = ({ navigation, route }) => {
  const { offerBanner } = useContext(MyData)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [newReleaseList, setNewReleaseList] = useState({ data: [], status: false })
  const [bestSellerBook, setBestSellerBook] = useState({ list: null, status: false })
  const [networkError, setNetworkError] = useState('')
  const cbseList = 1
  const noConnection = useSelector(state => state.product)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      newReleaseBooks()
      bestSeller()
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const error = noConnection[0]
    setNetworkError(error)
  }, [newReleaseList])

  function newReleaseBooks() {
    setNewReleaseList((prev) => {
      return { ...prev, status: true }
    })
    const newRealsesePayload = {
      "token": token
    }
    services.post(apiRoot.newReleaseBooks, newRealsesePayload)
      .then((res) => {
        if (res.status == 'success') {
          setNewReleaseList((prev) => {
            return { ...prev, data: res.newReleaseBooks, status: false }
          })
        }
      })
      .catch((res) => {
        console.log(res)
        setNewReleaseList((prev) => {
          return { ...prev, status: false }
        });

      })
      .finally(() => {
        setNewReleaseList((prev) => {
          return { ...prev, status: false }
        });
      })
  }
  function bestSeller() {
    setBestSellerBook((prev) => {
      return { ...prev, status: true }
    })
    const bestSellerPayload = {
      "token": token
    }
    services.post(apiRoot.bestSellerBooks, bestSellerPayload)
      .then((res) => {
        if (res.status == "success") {
          setBestSellerBook((prev) => {
            return { ...prev, list: res.bestSeller, status: false }
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setBestSellerBook((prev) => {
          return { ...prev, status: false }
        })
      })
  }
  function viewProductDetail(item, ind) {
    navigation.navigate('BookDetail', {
      data: item, index: ind
    })
  }

  const getCbseBookList = () => {
    navigation.navigate('CBSE', { data: cbseList })
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={{}}>
        <Image source={{ uri: item?.bannerPath }} style={{ height: '100%', width: width }} />
      </View>
    )
  }

  return (

    <>
      <SafeAreaView edges={['top', "right", "right"]} style={{ flex: 1, backgroundColor: fBTheme.fBPurple }}>
        {isConnected == true ? (
          <>
            {newReleaseList.status || bestSellerBook.status ?
              <Loader /> :
              <>
                <View style={{ flex: 1, backgroundColor: fBTheme.fBLigh }}>
                  <View style={styles.appHeader}>
                    <TouchableOpacity
                      onPress={() => { navigation.openDrawer() }}>
                      <View style={styles.menu}>
                        <Ionicons name='menu' size={35} color={fBTheme.fBWhite} />
                      </View>
                    </TouchableOpacity>
                    <View style={styles.fBLogo}>
                      <Image source={FBLogo} style={styles.logoStyle} />
                      <Text style={{ fontFamily: 'Trajan Pro Bold', fontSize: 18, color: fBTheme.fBWhite, flex: 1 }}>FOREVER BOOKS</Text>
                      <TouchableOpacity
                        onPress={() => getCbseBookList()}>
                        <Ionicons name="search" size={24} color={fBTheme.fBWhite} style={{ paddingVertical: 4, paddingHorizontal: 6 }} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ backgroundColor: fBTheme.fBLigh, height: 190, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, borderBottomWidth: 4, borderColor: fBTheme.fBPurple, overflow: 'hidden', elevation: 0.7 }}>
                    <Carousel
                      loop
                      width={width}
                      height={190}
                      autoPlay={true}
                      data={offerBanner}
                      scrollAnimationDuration={1500}
                      renderItem={renderItem}
                    />
                  </View>

                  <ScrollView>

                    {/*--------------Most Search Books start--------------------*/}

                    <View style={{ width: width, marginTop: 15, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, }}>
                      <Text style={{ textAlign: 'left', width: '90%', fontWeight: '700', marginBottom: 10, borderBottomWidth: .5, borderBottomColor: fBTheme.fBPurple, paddingBottom: 10, color: '#000', fontSize: 16 }}>Best Seller</Text>
                      <View style={{ width: '90%', padding: 10, backgroundColor: fBTheme.fBPurple, borderRadius: 6, flexDirection: 'row' }}>
                        <FlatList
                          data={bestSellerBook?.list}
                          horizontal
                          onScroll={e => {
                            const x = e.nativeEvent.contentOffset.x;
                            setCurrentPosition((x / 70).toFixed(0))
                          }}
                          renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity style={{ width: ((width / 3.7)), height: 145, backgroundColor: fBTheme.fBWhite, borderWidth: 2, borderColor: fBTheme.fBWhite, marginHorizontal: 3 }}
                                onPress={() => viewProductDetail(item.product_id, index)}>
                                <Image style={{ height: '100%', width: '100%' }} source={{ uri: item?.product_image_path + item?.getProductDesc[0]?.product_cover_image }}></Image>
                              </TouchableOpacity>
                            )
                          }}
                        />
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 3 }}>
                        <Pagination data={bestSellerBook?.list} currentPosition={currentPosition} />
                      </View>
                    </View>

                    {/* ----------------Most Search Books end------------------ */}
                    {/* ------------------New Release start-------------------- */}
                    <View style={{ width: width, marginTop: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: fBTheme.fBLigh }}>
                      <Text style={{ textAlign: 'left', width: '90%', fontWeight: '700', marginBottom: 10, borderBottomWidth: .5, borderBottomColor: fBTheme.fBPurple, paddingBottom: 10, color: '#000', fontSize: 16 }}>New Release</Text>
                      <View style={{ width: '90%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {newReleaseList?.data.map((item, index) => <ListItem key={item.product_id} item={item} index={index} width={width} viewProductDetail={viewProductDetail} />)}
                      </View>
                    </View>
                  </ScrollView>
                </View>
                {networkError != '' &&
                  <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
                }
              </>
            }
          </>
        ) : null}
        <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />


        {/* <Text onPress={(() => {
          navigation.navigate("FlatListPage")
        })}>Checking</Text> */}

      </SafeAreaView>
    </>
  )
};
const Pagination = ({ data, currentPosition }) => {
  return (
    <>
      {data?.slice(0, 6).map((item, index) => {
        return (
          <View style={{ width: currentPosition == index ? 20 : 8, height: 8, borderRadius: currentPosition == index ? 5 : 4, backgroundColor: currentPosition == index ? fBTheme.fBPurple : '#7B74BB', marginHorizontal: 1 }} key={item.product_id}></View>
        )
      })}
    </>
  )
}

function ListItem({ item, index, viewProductDetail }) {
  let productTitle = ''
  if (item.product_name.length > 35) {
    productTitle = item.product_name.substring(0, 32) + '...'
  } else {
    productTitle = item.product_name
  }

  return (
    <TouchableOpacity style={{ alignItems: 'center', marginVertical: 5, backgroundColor: fBTheme.fBWhite, width: '48%', padding: 10, borderRadius: 10, elevation: 0.5 }}
      onPress={() => viewProductDetail(item.product_id, index)}
    >
      <View style={{ height: 160, width: 130 }}>
        <Image style={{ height: '100%', width: '100%', borderRadius: 4 }} source={{ uri: item?.product_image_path + item?.getProductDesc[0]?.product_cover_image }} />
        {/* <Image source={require('../../assets/newRelease.png')} style={{position: 'absolute', height: 60, width: 60}}/> */}
      </View>
      <Text style={{ textAlign: 'center', padding: 10, color: '#000', textTransform: 'capitalize' }}>{productTitle}</Text>
    </TouchableOpacity>
  )
}

export default Dashboard
const styles = StyleSheet.create({
  appHeader: {
    width: '100%',
    height: 50,
    backgroundColor: fBTheme.fBPurple,
    flexDirection: 'row',
    paddingHorizontal: 5,
    elevation: 0.7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menu: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fBLogo: {
    flex: 1,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoStyle: {
    width: 32,
    height: 32,
    marginRight: 8
  },
  cartIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cartCircle: {
    width: 30,
    height: 30,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: fBTheme.fBWhite,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topHalf: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: Platform.OS == "android" ? fBTheme.fBPurple : 'green'//just testing
  },
  searchMainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20
  },
  searchInputContainer: {
    width: 220,
    height: 35,
    backgroundColor: fBTheme.fBWhite,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  searchInput: {
    marginLeft: 10,
    marginRight: 4
  },
  searchBtnContainer: {
    width: 50,
    height: 35,
    borderLeftWidth: 1,
    borderColor: fBTheme.fBPurple,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: fBTheme.fBWhite,
    justifyContent: 'center',
    alignItems: 'center'
  },
  catagoryContainer: {
    paddingHorizontal: 15,
    // marginTop: 20
  },
  catagoryHead: {
    fontWeight: 'bold',
    color: fBTheme.fBWhite
  },
  boardContainer: {
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 6,
  },
  catagoryLogo: {
    width: 85,
    height: 85,
  },
  boardIconStyle: {
    width: '100%',
    height: '100%'
  }

})