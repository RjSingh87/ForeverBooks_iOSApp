import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
// import Pdf from 'react-native-pdf'
import Share from 'react-native-share'
import { fBTheme } from '../../constant';


const PdfViewer = ({ navigation, route }) => {
    const pdfData = route.params.data
    const source = { uri: "data:application/pdf;base64," + pdfData };
    const share = async () => {
        try {
            const shareOption = {
                url: 'data:application/pdf;base64,' + pdfData,
                filename: 'invoice'
            }
            await Share.open(shareOption)

        } catch (error) {
            console.log(error)
        }
    }

    // async function downloadpdf() {
    //     const DocumentDir = RNFetchBlob.fs.dirs.DocumentDir;
    //     let pdfLocation = DocumentDir + '/' + 'test.pdf';
    //     RNFetchBlob.fs.writeFile(pdfLocation, pdfData, 'base64');
    //     console.log(pdfLocation, 'location')
    // }

    return (
        <View style={styles.container}>

            <View style={{ padding: 10 }}>
                <TouchableOpacity
                    onPress={() => share()}
                    style={{ padding: 10, borderRadius: 4, backgroundColor: fBTheme.fBGreen }}
                >
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: fBTheme.fBWhite }}>Download & Share</Text>
                </TouchableOpacity>
            </View>

            {/* <Pdf
                trustAllCerts={false}
                source={source}
                onLoadComplete={(numberOfPages, filePath) => {
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error, 'pdferror');
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}
                style={styles.pdf}
            /> */}
        </View>
    )
}

export default PdfViewer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        // alignItems: 'center',
        // marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
})