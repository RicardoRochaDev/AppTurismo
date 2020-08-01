import React,{ useEffect, useState } from 'react';
import {View, Text, SafeAreaView, Image, StyleSheet, Alert, ScrollView, PermissionsAndroid } from 'react-native';
import { set } from 'react-native-reanimated';
//import TurismoLogo from './AwesomeProject/Img/TurismoLogo.PNG';
import {Button, Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

//C:\Users\Ricky\Desktop\project\AwesomeProject\Img\TurismoLogo.PNG
// View = Div de html
// Text tiene que estar dentro de otro componente
//<Image source={TurismoLogo}> </Image>

const FichaRest = ({ route }) => {
    //const url = route.params.aloj.foto
    //console.log('entre');
    const [coordenada, setCoordenada] = useState({
        "lat": 0,
        "lng": 0
    })

    const requestUbicacionPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Ubicacion Permission",
              message:
                "Necesito acceso a tu ubicacion",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permiso concendido");
          } else {
            console.log("Ubicacion permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
    };

    useEffect(() => {
        requestUbicacionPermission();
        Geolocation.getCurrentPosition(
            (position) => {
            //console.log(position);
            setCoordenada({lat: position.coords.latitude, lng: position.coords.longitude});
            },
            (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }, []);


    const agregarFavoritos = async () => {
        //console.log('ALOJ', aloj);

        const listaFavoritos=  await global.storage.load({key:'favoritosAlojamientos'});
        console.log('LISTA LOAD', listaFavoritos);
        
        var pos = 0;
        var tamanio = listaFavoritos.length; 
        var encontrado= false;
        while ((encontrado == false) && (pos < tamanio)){
            if (listaFavoritos[pos].id == route.params.aloj){
                encontrado= true;
            }
            else{
                pos= pos + 1;
            }
        }

        if (encontrado){
            Alert.alert('Ya existe en Favoritos');
        }
        else{
            listaFavoritos.push(route.params.aloj);
            global.storage.save({
                key: 'favoritosAlojamientos', // Note: Do not use underscore("_") in key!
                data: listaFavoritos,
                expires: 1000 * 3600
                });

            const listaFavoritosS=  await global.storage.load({key:'favoritosAlojamientos'});
            console.log('LISTA SAVE ', listaFavoritosS);
            console.log('-----------------------------------------------------------------');
            console.log('-----------------------------------------------------------------');
            Alert.alert('Agregado a Favoritos');
        }    
    }


    return(   
        <View style={styles.principal}>
            <ScrollView>
                {/* <Ejecutar></Ejecutar> */}
                <Image  style={{width: 360, height:200}} source={{uri:route.params.aloj.foto}}/> 
                <Button
                    icon={<Icon name="favorite" size={25} color="blue" />   }
                    type='clear'       
                    onPress={() => {
                        //console.log('BOTON ', aloj);
                        agregarFavoritos();
                    }}
                />
        
                {/* <Text> ID: {route.params.id}</Text> */}
                <Text> Id: {route.params.aloj.id}</Text>
                <Text> Nombre: {route.params.aloj.nombre}</Text>
                <Text> Domicilio: {route.params.aloj.domicilio}</Text>
                <Text> Localidad: {route.params.aloj.localidades?.nombre}</Text>
                <Text> Categoria: {route.params.aloj.categorias?.estrellas}</Text>
                <Text> Clasificacion: {route.params.aloj.clasificaciones?.nombre}</Text>

                {/* <Text> CLASIFICACION : {console.log(data[0].nombre)}</Text>  */}
                {/* <Text> CLASIFICACION : {data.length ? data[0].nombre : 'sin datos'}</Text>  */}
                <Divider style={{height: 6, backgroundColor: '#6495ed' , borderRadius: 10, marginLeft: 10, marginRight: 10}} />
                <Text style={{fontWeight:'bold', fontSize: 20}}> Mapa (Ubicacion) </Text>
                <View style={styles.container}>      
                    <MapView
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        region={{
                            latitude: route.params.aloj.lat,
                            longitude: route.params.aloj.lng,
                            latitudeDelta: 0,
                            longitudeDelta: 0.0121,
                        }}
                        zoomControlEnabled= {true}
                        //zoomEnabled= {false}
                    >

                    <Marker
                        coordinate={{
                            latitude: route.params.aloj.lat,
                            longitude: route.params.aloj.lng,
                        }}
                        title={route.params.aloj.nombre}
                        />

                    <Marker
                        coordinate={{
                            latitude: coordenada.lat,
                            longitude: coordenada.lng,
                        }}
                        title={"Ubicacion Actual"}
                        pinColor={'green'}
                        />
                    </MapView>
                </View>
            </ScrollView>
        </View>
    )
}

const styles= StyleSheet.create({
    principal:{
        flex: 1,
        backgroundColor:'white'
    },
    container: {   
        height: 400,
        width: 300,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default FichaRest;