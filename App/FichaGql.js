import React,{ useEffect, useState } from 'react';
import {View, Text, SafeAreaView, Image, StyleSheet, ScrollView, PermissionsAndroid} from 'react-native';
//import TurismoLogo from './AwesomeProject/Img/TurismoLogo.PNG';
import {Button, Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const cajitasStyle =  {
    width: 25
}
//C:\Users\Ricky\Desktop\project\AwesomeProject\Img\TurismoLogo.PNG
// View = Div de html
// Text tiene que estar dentro de otro componente
//<Image source={TurismoLogo}> </Image>

const FichaGql = ({ route }) => {
    //const url = route.params.aloj.foto

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
    
    const agregarFavoritos = async ( aloj ) => {
        //console.log('ALOJ', aloj);

        const listaFavoritos=  await global.storage.load({key:'favoritosAlojamientos'});
        console.log('LISTA LOAD', listaFavoritos);
        listaFavoritos.push(aloj);
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


    return(
        <View style={styles.principal}>
            <ScrollView>
                <Image  style={{width: 360, height:200}} source={{uri:route.params.eg.foto}}/> 
                <Button
                    icon={<Icons name="favorite" size={25} color="blue" />   }
                    type='clear'
                    onPress={() => {
                        //console.log('BOTON ', aloj);
                        agregarFavoritos(aloj);
                    }}
                />
                <Text> Id: {route.params.eg.id}</Text>
                <Text> Nombre : {route.params.eg.nombre}</Text>
                <Text> Domicilio : {route.params.eg.domicilio}</Text> 
                <Text> Localidad : {route.params.eg.localidade.nombre}</Text>
                {/* <Text> Actividades Gastronomicos: {route.params.eg.actividad_gastronomicos[0]?.actividade.nombre}</Text> */}
                <Text> Actividades Gastronomicos:</Text>
                {route.params.eg.actividad_gastronomicos.map((actividad)=> (
                    <Text> <Icon name="circle" size={10} color="black" /> {actividad.actividade.nombre} </Text>
                ))}
                {/* <Text> Especialidad Gastronomicos: {route.params.eg.especialidad_gastronomicos[0]?.especialidade.nombre}</Text> */}
                <Text> Especialidad Gastronomicos: </Text>
                {route.params.eg.especialidad_gastronomicos.map((especialidad)=> (
                    <Text> <Icon name="circle" size={10} color="black" /> {especialidad.especialidade.nombre} </Text>
                ))}
                {/* <Text> CLASIFICACION : {route.params.aloj.clasificacion_id}</Text> */}
                {/* <Text> CLASIFICACION : {console.log(data[0].nombre)}</Text>  */}
                {/* <Text> CLASIFICACION : {data[0].nombre}</Text>  */}
                <Divider style={{height: 6, backgroundColor: '#6495ed' , borderRadius: 10, marginLeft: 10, marginRight: 10}} />
                <Text style={{fontWeight:'bold', fontSize: 20}}> Mapa (Ubicacion) </Text>
                <View style={styles.container}>      
                    <MapView
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        region={{
                            latitude: route.params.eg.lat,
                            longitude: route.params.eg.lng,
                            latitudeDelta: 0,
                            longitudeDelta: 0.0121,
                        }}
                        zoomControlEnabled= {true}
                        //zoomEnabled= {false}
                    >

                    <Marker
                        coordinate={{
                            latitude: route.params.eg.lat,
                            longitude: route.params.eg.lng,
                        }}
                        title={route.params.eg.nombre}
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

export default FichaGql;