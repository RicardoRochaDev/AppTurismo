import React, {useEffect} from 'react';
import {View, Text, Alert, StyleSheet, Image, ScrollView } from 'react-native';
//import { Image } from 'react-native-elements';
import { Button } from 'react-native-elements';



const Fotos = ({ route }) => {

    useEffect(() => {
        const prueba = async () => {

            // var A = 2;
            // var B = 3;
            // var C = 4;
            // global.storage.save({
            //     key: 'dato', // Note: Do not use underscore("_") in key!
            //     data: A,
            //     expires: 1000 * 3600
            // });
            // global.storage.save({
            //     key: 'dato', // Note: Do not use underscore("_") in key!
            //     data: B,
            //     expires: 1000 * 3600
            // });
            // global.storage.save({
            //     key: 'dato', // Note: Do not use underscore("_") in key!
            //     data: C,
            //     expires: 1000 * 3600
            // });
    
            // var dato= await global.storage.load({key:'dato'});
            // console.log(dato);

            // var g = []
            // g.push(1);
            // g.push(1);
            // g.push(1);
            // console.log(g);
            console.log('GG',route.params.listaURL);
            
        }   
        prueba();
        
    }, [])
    

    return(
        <View style={{flex:1}}>
            <ScrollView>
                {route.params.listaURL.map((url) => (
                    <Image
                        source={{ uri: url }}
                        style={{ width: 300, height: 400 , marginBottom: 10}}
                    />   
                ))}
            </ScrollView>

            {/* {            
            route.params.listaURL.map((url) => (
                <View> 
                    <Image
                        source={{ uri: url }}
                        style={{ width: 200, height: 200 }}
                    />   
                    <Text>  { url}</Text>  
                </View>
            ))
            } FUNCIONA */}

            {/* {            
            route.params.listaURL.map((url) => {
                // <Image
                //     source={{ uri: url }}
                //     style={{ width: 200, height: 200 }}
                // />   
                <Text>  { url}</Text>  
                
            })
            }    NO FUNCIONA    */}



        </View>

    );
}

export default Fotos;