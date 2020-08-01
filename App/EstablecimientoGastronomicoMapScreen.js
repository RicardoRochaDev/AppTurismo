import React, { useEffect, useState } from 'react';
import {View, Text, ScrollView, Alert, FlatList, Image, StyleSheet, Modal, TextInput, PermissionsAndroid} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import { Divider , Card, ListItem, Icon , Button , Input } from 'react-native-elements';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';


import ApolloClient from 'apollo-boost';
import { gql } from "apollo-boost";



//import axios from "axios"

const EstablecimientoGastronomicoMapScreen = ({navigation}) => {
    const [isError, setIsError]= useState(false);
    const [isFetching, setIsFetching]= useState(false);

    const [coordenada, setCoordenada] = useState({
      "lat": 0,
      "lng": 0
    })
    const [gastronomicos, setGastronomicos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [buscarNombre, setBuscarNombre] = React.useState('');
    const [buscarEspecialidad, setBuscarEspecialidad] = React.useState('');
    const [buscarLocalidad, setBuscarLocalidad] = React.useState('');
    const [buscarActividad, setBuscarActividad] = React.useState('');
    
    const [filtroNombre, setFiltroNombre] = React.useState('');
    const [filtroEspecialidad, setFiltroEspecialidad] = React.useState('');
    const [filtroLocalidad, setFiltroLocalidad] = React.useState('');
    const [filtroActividad, setFiltroActividad] = React.useState('');

    const [reset, setReset]= useState(0);

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




    const client = new ApolloClient({
      uri: 'http://' + direccionIP + ':8080/v1/graphql',
    });
 
    useEffect(() => {    

      const fetchData = async () => {
        setIsError(false);
        setIsFetching(true);
        try {
            const localData = await global.storage.load({key:'gastronomicos'});
            setGastronomicos(localData);
            console.warn('LOCAL DATA: ',localData);
            client
              .query({
                  query: gql`
                  query MyQuery {
                    gastronomicos {
                      foto
                      id
                      lat
                      lng
                      nombre
                      domicilio
                      localidade {
                        nombre
                      }
                      actividad_gastronomicos {
                        actividade {
                          nombre
                        }
                      }
                      especialidad_gastronomicos {
                        especialidade {
                          nombre
                        }
                      }
                    }
                  }               
                  `
              })
              .then(result => setGastronomicos(result.data.gastronomicos));
            // const localData = await global.storage.load({key:'alojamientos'});
            // console.warn(localData);
        } catch (error) {
            console.warn(error, ' GastronomicosListScreennnnn');
            setIsError(true);
        }
        setIsFetching(false); 
      }; 
  
      fetchData();
    },[reset]) 


    //Estable
    // useEffect(() => {    
    //   client
    //   .query({
    //       query: gql`
    //       query MyQuery {
    //         gastronomicos {
    //           foto
    //           id
    //           lat
    //           lng
    //           nombre
    //           domicilio
    //           localidade {
    //             nombre
    //           }
    //           actividad_gastronomicos {
    //             actividade {
    //               nombre
    //             }
    //           }
    //           especialidad_gastronomicos {
    //             especialidade {
    //               nombre
    //             }
    //           }
    //         }
    //       }               
    //       `
    //   })
    //   .then(result => setGastronomicos(result.data.gastronomicos));

    // },[reset]) 

    const filtrar = () => {
        //console.warn('ENTRADA', {buscarNombre}, {buscarLocalidad}, {buscarActividad});
        if (buscarNombre !== '') {
            client
            .query({
                query: gql`
                query MyQuery($nombre: String) {
                    gastronomicos(where: {nombre: {_eq: $nombre}}) {
                      foto
                      id
                      lat
                      lng
                      nombre
                      domicilio
                      localidade {
                        nombre
                      }
                      actividad_gastronomicos {
                        actividade {
                          nombre
                        }
                      }
                      especialidad_gastronomicos {
                        especialidade {
                          nombre
                        }
                      }
                    }
                  }
                `, variables: {nombre:buscarNombre}
            })
            .then(result => {
                // console.warn('AAAAAAAAAAAAAAA NO nombre', {buscarNombre}, {buscarLocalidad}, {buscarActividad});
                // console.warn('AAAAAAAAAAAAAAA NO nombre', buscarNombre , buscarLocalidad, buscarActividad);
                setGastronomicos(result.data.gastronomicos)});
        } 
        else{
            if (buscarLocalidad !== '') {
                client
                .query({
                    query: gql`
                    query MyQuery($localidad: String) {
                        localidades(where: {nombre: {_eq: $localidad}}) {
                          nombre
                          id
                          gastronomicos {
                            foto
                            id
                            lat
                            lng
                            nombre
                            domicilio
                            actividad_gastronomicos {
                              actividade {
                                nombre
                              }
                            }
                            especialidad_gastronomicos {
                              especialidade {
                                nombre
                              }
                            }
                            localidade {
                              nombre
                            }
                          }
                        }
                      }                      
                    `, variables: {localidad:buscarLocalidad}
                })
                .then(result => {
                    // console.warn('AAAAAAAAAAAAAAA NO localidad', {buscarLocalidad}, {buscarNombre}, {buscarActividad});
                    // console.warn('AAAAAAAAAAAAAAA NO localidad', buscarLocalidad, buscarNombre, buscarActividad);
                    // console.warn(result.data.localidades[0].gastronomicos[0]);
                    setGastronomicos(result.data.localidades[0].gastronomicos)});
            } 
            else{
                if (buscarActividad !== '') {
                    client
                    .query({
                        query: gql`
                        query MyQuery($actividad: String) {
                            actividades(where: {nombre: {_eq: $actividad}}) {
                              id
                              nombre
                              actividad_gastronomicos {
                                gastronomico {
                                  domicilio
                                  foto
                                  id
                                  lat
                                  lng
                                  nombre
                                  localidade {
                                    nombre
                                  }
                                  actividad_gastronomicos {
                                    actividade {
                                      nombre
                                    }
                                  }
                                  especialidad_gastronomicos {
                                    especialidade {
                                      nombre
                                    }
                                  }
                                }
                              }
                            }
                          }                                               
                        `, variables: {actividad:buscarActividad}
                    })
                    .then(result => {     
                        setGastronomicos(result.data.actividades[0].actividad_gastronomicos.map(g => g.gastronomico));
                    });
                }
                else{
                    if (buscarEspecialidad !== '') {
                      client
                      .query({
                          query: gql`
                          query MyQuery($especialidad: String) {
                            especialidades(where: {nombre: {_eq: $especialidad}}) {
                              id
                              nombre
                              especialidad_gastronomicos {
                                gastronomico {
                                  domicilio
                                  foto
                                  id
                                  lat
                                  lng
                                  nombre
                                  localidade {
                                    nombre
                                  }
                                  actividad_gastronomicos {
                                    actividade {
                                      nombre
                                    }
                                  }
                                  especialidad_gastronomicos {
                                    especialidade {
                                      nombre
                                    }
                                  }
                                }
                              }
                            }
                          }                                                                      
                          `, variables: {especialidad:buscarEspecialidad}
                      })
                      .then(result => {     
                          setGastronomicos(result.data.especialidades[0].especialidad_gastronomicos.map(g => g.gastronomico));
                      });
                    }  
                }
            }   
        }
    }


    useEffect(() => {
      filtrar()}, [buscarNombre, buscarLocalidad, buscarActividad, buscarEspecialidad])


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
                    <Text style={{marginTop:15}}> Actividad </Text>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 5 }}
                        onChangeText={text => setFiltroActividad(text)}
                        value={filtroActividad}
                    />
                    <Text style={{marginTop:15}}> Especialidad </Text>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 5 }}
                        onChangeText={text => setFiltroEspecialidad(text)}
                        value={filtroEspecialidad}
                    />

                    <Button
                        title="Filtrar"
                        // onPress={setModalVisible(false)} //tira error. 
                        onPress={() => {
                            setBuscarNombre(filtroNombre);
                            setBuscarEspecialidad(filtroEspecialidad);
                            setBuscarLocalidad(filtroLocalidad);
                            setBuscarActividad(filtroActividad);
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
                            <Text style={{textAlign:'center'}}> MAPA DE ESTABLECIMIENTO</Text>
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
                                  setFiltroEspecialidad('')
                                  setFiltroLocalidad('')
                                  setFiltroActividad('')
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
                    >
                   {gastronomicos.map(establecimientoGastronomico => (                       
                        <Marker key={establecimientoGastronomico.id.toString()}
                        coordinate={{
                            latitude: establecimientoGastronomico.lat,
                            longitude: establecimientoGastronomico.lng,
                        }}
                        title={establecimientoGastronomico.nombre}
                        description={'asdasd'}
                        onPress={() => navigation.navigate('Ficha', { eg: establecimientoGastronomico })}
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

export default EstablecimientoGastronomicoMapScreen;