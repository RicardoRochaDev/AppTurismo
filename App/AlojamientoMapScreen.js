import React, { useEffect, useState } from 'react';
import {View, Text, ScrollView, Alert, FlatList, Image, StyleSheet, Modal, TextInput, PermissionsAndroid} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import { Divider , Card, ListItem, Icon , Button , Input } from 'react-native-elements';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import axios from "axios"

const AlojamientoMapScreen = ({navigation}) => {
    //const navigation = useNavigation()
    const [isError, setIsError]= useState(false);
    const [isFetching, setIsFetching]= useState(false);
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [reset, setReset]= useState(0);

    const [buscarNombre, setBuscarNombre] = React.useState('');
    const [buscarLocalidad, setBuscarLocalidad] = React.useState('');
    const [buscarCategoria, setBuscarCategoria] = React.useState('');
    const [buscarClasificacion, setBuscarClasificacion] = React.useState('');
    
    const [filtroNombre, setFiltroNombre] = React.useState('');
    const [filtroLocalidad, setFiltroLocalidad] = React.useState('');
    const [filtroCategoria, setFiltroCategoria] = React.useState('');
    const [filtroClasificacion, setFiltroClasificacion] = React.useState('');

    const [coordenada, setCoordenada] = useState({
        "lat": 0,
        "lng": 0
    })
    //const [activeMarker, setActiveMarker] = useState(null);
    //const [aloj, setAloj] = useState({});

    //const [cantidadAlojamientos, setCantidadAlojamientos] = useState(0);

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
            console.log(position);
            setCoordenada({lat: position.coords.latitude, lng: position.coords.longitude});
            },
            (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }, []);


    useEffect(() => {
        
        const fetchData = async () => {
            setIsError(false);
            setIsFetching(true);
            try {
                const localData = await global.storage.load({key:'alojamientos'});
                setData(localData);
                // console.warn(localData);
                const response = await axios.get('http://' + direccionIP + ':3000/alojamientos?select=*,localidades(id,nombre),categorias(id,estrellas,valor),clasificaciones(id,nombre)');
                setData(response.data);
                // global.storage.save({
                //     key: 'alojamientos', // Note: Do not use underscore("_") in key!
                //     data:  data,
                //     expires: 1000 * 3600
                // }); 

                // const localData = await global.storage.load({key:'alojamientos'});
                // console.warn(localData);
            } catch (error) {
                console.warn(error);
                setIsError(true);
            }
            setIsFetching(false);
        };       

        fetchData();     
    }, [reset]); 

    const alojamientoFiltrado = data.filter(aloj => aloj.id == 1);

    const filtrar = () => {
        //console.warn('ENTRADA', {buscarNombre}, {buscarLocalidad}, {buscarActividad});
        if (buscarNombre !== '') {
            var alojamientoFiltrado = data.filter(aloj => aloj.nombre == buscarNombre);
            setData(alojamientoFiltrado);
        } 
        else{
            if (buscarLocalidad !== '') {
                var alojamientoFiltrado = data.filter(aloj => aloj.localidades.nombre == buscarLocalidad);
                setData(alojamientoFiltrado);
            } 
            else{
                if (buscarCategoria !== '') {
                    var alojamientoFiltrado = data.filter(aloj => aloj.categorias.valor == buscarCategoria);
                    setData(alojamientoFiltrado);   
                }
                else{
                    if (buscarClasificacion !== '') {
                        var alojamientoFiltrado = data.filter(aloj => aloj.clasificaciones.nombre == buscarClasificacion);
                        setData(alojamientoFiltrado);   
                    }
                }
            }   
        }
    }

    useEffect(() => {
        filtrar()}, [buscarNombre, buscarLocalidad, buscarCategoria, buscarClasificacion])


    return(
        <View style={{flex:1}}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.centeredView}>
                    <Text style={styles.modalText}>Filtros</Text>
                    <Text style={{marginTop:15}}> Nombre </Text>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 5 }}
                        onChangeText={text => setFiltroNombre(text)}
                        value={filtroNombre}
                    />
                    <Text style={{marginTop:15}}> Localidad </Text>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 5 }}
                        onChangeText={text => setFiltroLocalidad(text)}
                        value={filtroLocalidad}
                    />
                    <Text style={{marginTop:15}}> Categoria </Text>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 5 }}
                        onChangeText={text => setFiltroCategoria(text)}
                        value={filtroCategoria}
                    />
                    <Text style={{marginTop:15}}> Clasificacion </Text>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 5 }}
                        onChangeText={text => setFiltroClasificacion(text)}
                        value={filtroClasificacion}
                    />


                    <Button
                        title="Filtrar"
                        // onPress={setModalVisible(false)} //tira error. 
                        onPress={() => {
                            setBuscarNombre(filtroNombre);
                            setBuscarLocalidad(filtroLocalidad);
                            setBuscarCategoria(filtroCategoria);
                            setBuscarClasificacion(filtroClasificacion);
                            setModalVisible(false)      
                        }} //se activa solo una ves cuando tocas el boton
                        />
                </View>
            </Modal>
            
            {/* Primera mitad */}
            <View style={{flex:0.1}} >           
                <Text style={{fontSize:20, textAlign:"center"}}>APP TURISMO</Text> 
            </View>

            {/* Segunda mitad */}
            <View style={{flex:1}}>
       
                <View style={{flex:0.1}}>
                    <View style={{flex: 1,flexDirection:'row'}}>
                        <View style={{flex: 2, justifyContent:'center'}}>
                            <Text style={{textAlign:'center'}}> MAPA DE ALOJAMIENTO</Text>
                        </View>
                        <View style={{flex: 1, flexDirection:'row'}}>
                            <Button
                                title="Filtro"
                                onPress={() => setModalVisible(true)}
                            />
                            <Button
                                title="Reset"
                                onPress={() => {
                                    setReset(reset + 1)
                                    setFiltroNombre('')
                                    setFiltroCategoria('')
                                    setFiltroLocalidad('')
                                    setFiltroClasificacion('')
                                }}
                            />
                        </View>
                    </View>                
                </View>

                <View style={{flex:1}}>    
                    <MapView
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        region={{
                            latitude: -54.816697,
                            longitude: -68.322815,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }}
                        zoomControlEnabled= {true}
                        //zoomEnabled= {false}
                        //onPress={()=>{setActiveMarker(false)}}
                    >
                   {data.map(alojamiento => (                    
                        <Marker key={alojamiento.id.toString()}
                        coordinate={{
                            latitude: alojamiento.lat,
                            longitude: alojamiento.lng,
                        }}
                        title={alojamiento.nombre}
                        // description={'asdasd'}
                        onPress={() => navigation.navigate('Ficha', { aloj: alojamiento })}
                        // onPress={(event) => {
                        //     event.stopPropagation()
                        //     setActiveMarker(true)
                        //     setAloj(alojamiento)

                        //   }}
                        >
                        {/* <View style={{backgroundColor: "red", padding: 10}}>
                            <Text>HOLA</Text>
                        </View>     */}         
                        </Marker>
                    ))}    

                    <Marker
                        coordinate={{
                            latitude: coordenada.lat,
                            longitude: coordenada.lng,
                        }}
                        title={"Ubicacion Actual"}
                        pinColor={'green'}
                        />      
                    </MapView>
                    {/* {activeMarker ?
                    (<View style={{ position: 'absolute', bottom: 20, left: 20, height: 200, width: 200, backgroundColor: '#32cd32' , borderRadius: 30}}>
                        <Button
                            title="Ficha"
                            onPress={() => navigation.navigate('Ficha', { aloj: aloj })}
                        />        
                    </View>)
                    : null} */}
                </View>             
            </View>    
        </View>
    );
}


const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    centeredView: {
      flex: 1,
      //justifyContent: "center",
      //alignItems: "center",
      marginTop: 50,
      backgroundColor: "#32cd32"
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });

export default AlojamientoMapScreen;