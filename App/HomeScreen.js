import React, { useState, useRef } from 'react';
import {View, Text, StyleSheet} from 'react-native';
//import TurismoLogo from './AwesomeProject/Img/TurismoLogo.PNG';

import Video from 'react-native-video';
import { RNCamera } from 'react-native-camera';
import { set } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Entypo';
import { Tile } from 'react-native-elements';


//C:\Users\Ricky\Desktop\project\AwesomeProject\Img\TurismoLogo.PNG
// View = Div de html
// Text tiene que estar dentro de otro componente
//<Image source={TurismoLogo}> </Image>

const HomeScreen = () => {

    return(
        //View styke={{flex:1}}> no tiro error
        <View style={{flex:1}}>
            <View style={{flex:1}}>
                <Tile
                    imageSrc={require('C:/Users/Ricky/Desktop/project/AwesomeProject/Img/Notro.jpg')}
                    title="Bienvenido a la aplicacion de Turismo de Tierra del Fuego"
                    featured
                    caption="Informacion a la alcance de tu mano"
                    activeOpacity={1}
                    height={600}
                />



                {/* source={require('C:/Users/Ricky/Desktop/project/AwesomeProject/Video/DrStone1.mkv')} */}
                {/* <Video source={require('C:/Users/Ricky/Desktop/project/AwesomeProject/Video/DrStone1.mkv')}   // Can be a URL or a local file.
                    ref={(ref) => {
                        this.player = ref
                    }}                                      // Store reference
                    onBuffer={this.onBuffer}                // Callback when remote video is buffering
                    onError={this.videoError}               // Callback when video cannot be loaded
                    style={styles.backgroundVideo} /> */}


                {/* {foto ? <Image style={{width:200, height: 200}} source={{uri: foto}}></Image> : null} */}
                
            </View>       
        </View>
    )
}

const styles = StyleSheet.create({
    backgroundVideo: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
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

export default HomeScreen;