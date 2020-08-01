import React, { useState, useRef } from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import { RNCamera } from 'react-native-camera';

const Camara = ({ route }) => {
    //const [foto, setFoto] = useState(null);
    let camera = useRef(null);

    const takePicture = async () => {
        if (camera) {
            const options = { quality: 0.5, base64: true };
            const data = await camera.takePictureAsync(options);
            console.log(data.uri);
            //setFoto(data.uri);
            
            console.log(route.params.id);
            var listaFavoritosFotos=  await global.storage.load({key:'favoritosAlojamientosFotos'});
            var captura= {
                'id': route.params.id,
                'url': data.uri
            }
            listaFavoritosFotos.push(captura);
            

            // console.log('LISTA LOAD', listaFavoritosFotos);
            // listaFavoritos.push(aloj);
            global.storage.save({
                key: 'favoritosAlojamientosFotos', // Note: Do not use underscore("_") in key!
                data: listaFavoritosFotos,
                expires: 1000 * 3600
            });


            listaFavoritosFotos=  await global.storage.load({key:'favoritosAlojamientosFotos'});
            console.log('AQUI ', listaFavoritosFotos);
        }
      };    

    return(
        //View styke={{flex:1}}> no tiro error
        <View style={{flex:1}}>
            <View style={styles.container}>
                <RNCamera
                ref={(ref) => {
                    camera = ref;
                }}
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
                androidRecordAudioPermissionOptions={{
                    title: 'Permission to use audio recording',
                    message: 'We need your permission to use your audio',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
                />
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={takePicture} style={styles.capture}>
                    <Icon name="circle" size={50} color="black" />
                </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 2,
        paddingHorizontal: 2,
        alignSelf: 'center',
        margin: 20,
    },
    
  });

export default Camara;