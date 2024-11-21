import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, RefreshControl, Image, ScrollView, Modal, FlatList, Alert } from 'react-native'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import { apiRoot, fBTheme, token, cbseboard } from '../../constant';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import Services from '../../services';
import Loader from '../common/Loader';
import Lottie from 'lottie-react-native';
import CheckInternet from './CheckInternet';
// import Voice from '@react-native-voice/voice';
import services from '../../services';

const CBSE = ({ navigation, route }) => {

  const data = useSelector(state => state.product)
  const [search, setSearch] = useState('')
  const [isModalVisible, setModalVisibility] = useState({ state: false, type: '' });
  const [modalData, setModalData] = useState({ list: [], type: '', selected: null });
  const [selectData, setSelectData] = useState({ class: null, subject: null });
  const [productList, setProductList] = useState({ list: [], typeList: null, status: false })
  const [isLoader, setIsLoader] = useState(false)
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState({ status: false, type: '' })

  // search by Voice //
  const [isListening, setIsListening] = useState(false)
  const [detectVoice, setDetectVoice] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(false)
  const [searchLoader, setSearchLoader] = useState(false)
  // search by Voice //



  const filterData = async (val) => {
    setSearchError(false)
    setSearchLoading(true)
    const searchPayload = {
      "token": token,
      "searchString": val
    }
    services.post(apiRoot.searchBooks, searchPayload)
      .then((res) => {

        if (res.status == "success") {
          setSearchLoading(false)
          if (res.data.length) {
            let newData = res.data.map((item => {
              let selectedType = item?.productDesc[0];
              return {
                ...item,
                selectedType: selectedType
              }
            }));
            setProductList((prev) => {
              return { ...prev, list: newData }
            })
            setIsLoader(false)
          } else {
            setProductList((prev) => {
              return { ...prev, list: [] }
            })
          }
        } else {
          setSearchError(true)
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setSearchLoading(false)
      })
  }
  // useEffect(() => {
  //   Voice.onSpeechStart = onSpeechStart;
  //   Voice.onSpeechEnd = endVoice;
  //   Voice.onSpeechResults = onSpeechResults;
  //   Voice.onSpeechError = onSpeechError;
  //   return () => {
  //     Voice.destroy().then(Voice.removeAllListeners())
  //   };
  // }, [])
  // Search by Voice //
  const onSpeechStart = (e) => {
  }
  const onSpeechResults = async (e) => {
    setDetectVoice(e.value[0])
    await filterData(e.value[0])
  }

  const endVoice = async () => {
    setSearchLoader(true)
    
    try {
      Voice.removeAllListeners();
      await Voice.stop()
      setIsListening(false)

    } catch (error) {
      console.log(error)
    }
  }
  const onSpeechError = (e)=>{
    setIsListening(false);
    setSearchType(((prev) => {
      return {...prev, status: false}
    }))

    // ?? //
    // if(detectVoice==''){   
    //   Alert.alert("Info!", `Didn't hear that. Try again.`)
    // }
    // ?? //
  }

  const searchManual = async (val) => {
    if (val == "mic") {
      setIsListening(true);
      setDetectVoice('')
      setSearchType((prev) => {
        return { ...prev, status: true, type: "mic" }
      })
      try {
        await Voice.start('en-US')
      } catch (error) {
        console.log(error)
      }
    } else if (val == "key") {
      setSearch('')
      setSearchType((prev) => {
        return { ...prev, status: true, type: "key" }
      })
      setSelectData((prev) => {
        return { ...prev, class: null, subject: null }
      })
      setProductList((prev) => {
        return { ...prev, list: data }
      });
    } else if (val == "goBack") {
      setSearchError(false)
      if (detectVoice == '') {
        endVoice()
      }
      setIsListening(!isListening);
      setSearchType((prev) => {
        return { ...prev, status: false, type: "goBack" }
      });
    }
  }
  // Search by Voice //

  useEffect(() => {
    if (selectData.class == null || selectData.subject == null) {
      setProductList((prev) => {
        return { ...prev, list: data }
      })
    };
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [productList])

  function openModal(Val) {
    if (Val == 'class') {
      setIsLoader(true)
      setModalVisibility((prev) => {
        return { ...prev, state: true, type: Val }
      })
      Services.post(apiRoot.getClasses, token)
        .then((res) => {
          if (res.status == 'success') {
            let classes = res.data
            let items = []
            for (let cls of classes) {
              items.push({ name: cls.class_name, id: cls.class_id })
            }
            setModalData((prev) => {
              return { ...prev, list: items, type: 'class', selected: selectData.class }
            });
            setIsLoader(false)
          } else {
            Alert.alert('Info!','data not found.')
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          setIsLoader(false)
        })
    }
    if (Val == 'subject') {
      if (selectData.class == null) {
        Alert.alert('Info!','Select class first.')
      } else {
        setIsLoader(true)
        setModalVisibility((prev) => {
          return { ...prev, state: true, type: Val }
        })
        const subjPayload = {
          class_id: selectData.class.id,
          token: token
        }
        Services.post(apiRoot.getSubjects, subjPayload)
          .then((res) => {
            if (res.status == 'success') {
              let subject = res.data
              let subjectList = []
              for (let suj of subject) {
                subjectList.push({ name: suj.subject_name, id: suj.subject_id })
              }
              setModalData((prev) => {
                return { ...prev, list: subjectList, type: 'subject', selected: selectData.subject }
              });
              setIsLoader(false)
            } else {
              Alert.alert('Info','data not found.')
            }
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            setIsLoader(false)
          })
      }

    }
  }
  function getProductListAccToSubject(cls, sub) {
    setIsLoader(true)
    const booklistPayload = {
      "board_id": cbseboard,
      "class_id": cls,
      "subject_id": sub,
      "token": token
    }
    Services.post(apiRoot.getProductListAccToSubject, booklistPayload)
      .then((res) => {
        if (res.status == "success") {
          if (res.data.length) {
            let newData = res.data.map((item => {
              let selectedType = item?.productDesc[0];
              return {
                ...item,
                selectedType: selectedType
              }
            }));
            setProductList((prev) => {
              return { ...prev, list: newData }
            })
            setIsLoader(false)
          } else {
            setProductList((prev) => {
              return { ...prev, list: [] }
            })
          }
        } else {
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setIsLoader(false)
      })
  }
  function getData(val, item) {
    if (val == 'class') {
      setSelectData((prev) => {
        return { ...prev, class: item, subject: null }
      });
      setProductList((prev) => {
        return { ...prev, list: [] }
      })
      setModalVisibility(false)
      getProductListAccToSubject(item.id, "")
    }
    if (val == 'subject') {
      alert(selectData.subject)
      setSelectData((prev) => {
        return { ...prev, subject: item }
      });
      setModalVisibility(false)
      getProductListAccToSubject(selectData.class.id, item.id)
    }
  }
  function viewProductDetail(item, ind) {
    navigation.navigate('BookDetail', {
      data: item, index: ind
    })
  }

  function closePopup() {
    setModalVisibility(false)
    setProductList((prev) => {
      return { ...prev, status: false }
    })
  }
  const onRefresh = useCallback((val) => {
    if(val=='clear'){
        setSearchError(false)
        setSearchType((prev) => {
        return { ...prev, status: true }
      })
    setSearch('')
    }else{
        setIsListening(false)
        setLoading(true);
        setProductList((prev) => {
          return { ...prev, list: data }
        });
        setSearchError(false)
        setSelectData({ class: null, subject: null })
        setDetectVoice('')
        setSearchType((prev) => {
          return { ...prev, status: false }
        })
    }
  }, []);

  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isConnected == true ? (
        <View style={{ flex: 1, backgroundColor: fBTheme.fBLigh }}>
          {!searchType.status ?
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', paddingHorizontal: 6, paddingVertical: 10, backgroundColor: fBTheme.fBPurple }}>
              <View style={{ backgroundColor: fBTheme.fBPurple, flexDirection: 'row', flex: 1, justifyContent: 'space-around' }}>
                <TouchableOpacity style={{ flexDirection: 'row', width: '48%' }}
                  onPress={() => { openModal('class') }}>
                  <View style={{ backgroundColor: '#fff', flex: 1, height: 40, borderBottomLeftRadius: 6, borderTopLeftRadius: 6, paddingHorizontal: 10, justifyContent: 'center' }}>
                    <Text style={{ color: selectData.class == null ? fBTheme.fbGray : "#000" }}>{selectData.class == null ? 'Class' : selectData.class.name}</Text>
                  </View>
                  <View style={{ backgroundColor: '#fff', width: 40, height: 40, borderTopRightRadius: 6, borderBottomRightRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
                    <Feather name='chevron-down' size={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', width: '48%' }}
                  onPress={() => { openModal('subject') }}>
                  <View style={{ backgroundColor: '#fff', flex: 1, height: 40, borderBottomLeftRadius: 6, borderTopLeftRadius: 6, paddingHorizontal: 10, justifyContent: 'center' }}>
                    <Text style={{ color: selectData.subject == null ? fBTheme.fbGray : "#000" }}>{selectData.subject == null ? 'Subject' : (selectData.subject.name.length >= 10 ? selectData.subject.name.substring(0, 9) + '...' : selectData.subject.name)}</Text>
                  </View>
                  <View style={{ backgroundColor: '#fff', width: 40, height: 40, borderTopRightRadius: 6, borderBottomRightRadius: 6, justifyContent: 'center', alignItems: 'center'}}>
                    <Feather name='chevron-down' size={20} />
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{width: 44, justifyContent: 'center', alignItems: 'center'}}
                onPress={() => {
                  searchManual('key')
                }}
              >
                <Ionicons name='search' size={24} color={fBTheme.fBWhite}/>
              </TouchableOpacity>
              {/* <TouchableOpacity style={{ width: 44, justifyContent: 'center', alignItems: 'center'}}
                onPress={() => searchManual('mic')}>
                {isListening ?
                  <Ionicons name='ellipsis-horizontal-sharp' size={24} color={fBTheme.fBWhite}/>:
                  <Ionicons name='mic' size = {24} color={fBTheme.fBWhite}/>
                }
              </TouchableOpacity> */}
            </View> :
            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center', backgroundColor: fBTheme.fBPurple, paddingHorizontal: 10, paddingVertical: 10}}>
              <View style={{ flexDirection: 'row', width: "80%"}}>
                <View style={{ flex: 1, height: 40,}}>
                  <TextInput autoFocus={searchType.type == "key" ? true:false} editable={searchType.type == "key" ? true : false} type='text' placeholder={searchType.type == "key" ? "Search here..." : "Listening...."} value={searchType.type == "key" ? search: detectVoice} placeholderTextColor={fBTheme.fbGray} style={{color: '#000', flex: 1, paddingLeft: 10, backgroundColor: 'white', borderTopLeftRadius: 6, borderBottomLeftRadius: 6}}
                    onChangeText={val => {
                      setSearch(val);
                      if(val!=''){
                      filterData(val);
                      }
                    }}
                  />
                </View>
                <TouchableOpacity delayPressIn={150} style={{width: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderTopRightRadius: 6, borderBottomRightRadius: 6}}
                  onPress={() => {
                    if(search != ''){
                      onRefresh('clear')
                    } else {
                      setSearchType(((prev) => {
                        return {...prev, status: false}
                      }))
                      setDetectVoice('')
                      setIsListening(false)
                      setSelectData((prev) => {
                        return {...prev, class: null, subject: null}
                      })
                      setProductList((prev) => {
                        return {...prev, list: data}
                      });
                      setSearchError(false)
                    }
                  }}
                >
                  <Ionicons name={search == '' ? "chevron-back" : "close"} size={24} color={fBTheme.fBPurple}/>
                </TouchableOpacity>
              </View>
              {searchType.type != "key" &&
                <TouchableOpacity style={{ width: 44, justifyContent: 'center', alignItems: 'center', }}
                  onPress={() => {
                    isListening ?
                      searchManual("goBack") :
                      setSearchType(((prev) => {
                        return {...prev, status: false}
                      }));
                      setProductList((prev) => {
                        return {...prev, list: data}
                      });
                    setSearchError(false)
                  }
                  }>
                  {isListening ?
                    <Lottie source={require('../../assets/recording.json')}
                      autoPlay loop
                      style={styles.recording}
                    />
                    :
                    <Ionicons name='mic' size={24} color={fBTheme.fBWhite}/>
                  }
                </TouchableOpacity>

              }
            </View>
          }

          {
            isModalVisible.state &&
            <SelectField closePopup={closePopup} modalData={modalData} getData={getData} isLoader={isLoader} isModalVisible={isModalVisible} />
          }
          <View style={{ padding: 10, flex: 1 }}>

            {/* <ScrollView> */}
            {searchLoading ?
              <Loader /> :
              <>
                {searchError ?
                  <>
                    <Text style={{ color: 'red', fontSize: 16, alignSelf: 'center' }}>No result found for : {searchType.type == 'key' ? search : detectVoice}</Text>
                    <View style={{ paddingVertical: 10, borderBottomWidth: .7 }}>
                      <Text style={{ color: fBTheme.fbGray, fontWeight: '700' }}>Suggested Books</Text>
                    </View>
                  </> :
                  null
                }
                {productList.list.length == 0 ?
                  <View style={styles.animationContainer}>
                    <Lottie source={require('../../assets/data-not-found.json')}
                      autoPlay loop
                      style={styles.animationStyle}
                    />
                    <Text style={{ fontSize: 18, fontWeight: '500', color: fBTheme.fBPurple, textAlign: 'center' }}>Data not found</Text>
                  </View> :
                  <FlatList
                    data={productList.list}
                    renderItem={({ item, index }) => <ListItem item={item} index={index} viewProductDetail={viewProductDetail} />}
                    keyExtractor={item => item.product_id}

                    refreshControl={
                      <RefreshControl
                        refreshing={isLoading}
                        onRefresh={onRefresh}
                        tintColor={fBTheme.fBPurple}
                        title='Refresh'
                      />
                    }
                  />
                }
              </>
            }
          </View>
        </View>

      ) : null}
      <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
    </SafeAreaView>
  )
};

function SelectField({ closePopup, modalData, getData, isLoader, isModalVisible }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
    >
      {isLoader == true ?
        <Loader /> :
        <View style={styles.garyContainer}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => closePopup()}
          />
          <View style={styles.listBox}>
            <View style={{ backgroundColor: fBTheme.fbGray, width: 35, height: 6, borderRadius: 4, alignSelf: 'center', marginVertical: 6 }}></View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6, paddingVertical: 10, borderBottomWidth: .5, }}>
              <TouchableOpacity style={{ width: 50 }}
                onPress={() => closePopup()}
              >
                <Text style={{ color: fBTheme.fBRed }}>Close</Text>
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ alignSelf: 'center', textTransform: 'capitalize', fontWeight: 'bold' }}>{isModalVisible.type} List</Text>
              </View>
              <View style={{ width: 50 }}>
              </View>

            </View>


            <ScrollView>
              {modalData.list.map((item, index) => {
                let clsName = 'radio-button-off'
                if (modalData.selected?.id == item.id) {
                  clsName = 'radio-button-on'
                }
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => { getData(modalData.type, item) }}
                    style={styles.selectItemContainer}>
                    <View style={styles.radioBox}>
                      <Ionicons name={clsName} color={fBTheme.fBPurple} size={20} />
                    </View>
                    <Text style={{ color: fBTheme.fbGray }}>{item.name}</Text>
                  </TouchableOpacity>
                )
              })
              }
            </ScrollView>
          </View>
        </View>
      }
    </Modal>
  )
}

function ListItem({ item, index, viewProductDetail }) {
  let productTitle = ''
  if (item?.product_name?.length > 60) {
    productTitle = item.product_name.substring(0, 50) + '...'
  } else {
    productTitle = item.product_name
  }
  let productDes = ''
  if (item?.product_short_desc?.length > 30) {
    productDes = item.product_short_desc.substring(0, 30) + '...'
  } else {
    productDes = item.product_short_desc
  }
  // return null;
  return (
    <>
    {item.productDesc!=undefined?
    <TouchableOpacity style={{ marginVertical: 10, flexDirection: 'row', flex: 1, padding: 10, borderRadius: 6, backgroundColor: fBTheme.fBWhite, elevation: .7 }} key={item.product_id}
      onPress={() => viewProductDetail(item.product_id, index)}>
      <View style={{ width: 120, height: 140, borderRadius: 6, overflow: 'hidden' }}>
        <Image style={{ width: "100%", height: '100%' }} source={{ uri: item?.selectedType?.product_image_path + item.selectedType?.product_cover_image }} />
      </View>
      <View style={{ paddingLeft: 15, flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, color: '#000', fontWeight: '500', textTransform: 'capitalize' }}>{productTitle}</Text>
          <Text style={{ fontWeight: '500', color: '#000', marginTop: 4}}>{item.selectedType?.book_type_name}</Text>
          <View style={{ marginVertical: 6 }}>
            <Text style={{ color: fBTheme.fbGray }}>{productDes}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 10, borderTopWidth: .5, borderBottomWidth: .5, padding: 4 }}>
            <Text style={{ color: fBTheme.fBGreen, fontSize: 18, }}>₹{item?.selectedType?.product_sale_price}</Text>
            {item?.selectedType?.product_sale_price<item?.selectedType?.product_mrp_price?
            <Text style={{ textDecorationLine: 'line-through', color: fBTheme.fbGray, marginLeft: 20, marginTop: 4 }}>₹ {item?.selectedType?.product_mrp_price}</Text>:null
            }
          </View>
        </View>
      </View>
    </TouchableOpacity>:null
    }

    </>
  )
}

export default CBSE

const styles = StyleSheet.create({
  garyContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  listBox: {
    backgroundColor: '#fff',
    maxHeight: '50%',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  selectItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    borderBottomWidth: 1,
    borderColor: "#DADADB",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 4
  },
  radioBox: {
    paddingHorizontal: 10,
  },
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  animationStyle: {
    width: 200,
    height: 200,
    alignSelf: 'center'
  },
  recording: {
    width: 40,
    height: 40,
    alignSelf: 'center'
  }
})