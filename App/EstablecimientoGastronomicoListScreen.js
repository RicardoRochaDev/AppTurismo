import React, { useEffect, useState } from 'react';
import {View, Text, ScrollView, Alert, FlatList, Image , StyleSheet, Modal, TextInput } from 'react-native';
import {useNavigation} from '@react-navigation/native';

import { Divider , Card, ListItem, Icon , Button , Input } from 'react-native-elements';

import ApolloClient from 'apollo-boost';
import { gql } from "apollo-boost";




// const IrMapa = () => {
//     navigation.navigate('Map')
// }

const EstablecimientoGastronomicoScreen = ({navigation}) => {
    //const navigation = useNavigation()
    const [isError, setIsError]= useState(false);
    const [isFetching, setIsFetching]= useState(false);


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
              //console.warn('LOCAL DATA: ',localData);
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
    


    // ESTABLE
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



    function MostrarGastronomico({ eg }) {
        return (
            <Card key={eg.id.toString()} title={eg.nombre} titleStyle={{fontSize:16}}> 
                <View style={{flexDirection:'row', flex:1}}>
                    <Image            
                        style={{width:100, height:150}}     
                        resizeMode="cover"
                        source={{ uri: eg.foto }}
                    />
                    <View style={{justifyContent: 'space-around', flexDirection:'row', flex:1}}>
                        <Button
                            title="Ficha"
                            onPress={() => navigation.navigate('Ficha', { eg: eg })}
                        />
                        {/* <Button
                            title="Mapa"
                            onPress={() => navigation.navigate('Mapa', { eg: eg })}
                        /> */}
                        <Button
                            icon={<Icon name="favorite" size={25} color="blue" />   }
                            type='clear'
                            onPress={() => {
                                //console.log('BOTON ', aloj);
                                Alert.alert('Implementacion pendiente');
                            }}
                        />
                    </View>
                </View>             
            </Card>      
        );
    }

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
                // console.warn('nombre', {buscarNombre}, {buscarLocalidad}, {buscarActividad});
                // console.warn('nombre', buscarNombre , buscarLocalidad, buscarActividad);
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
                    // console.warn('localidad', {buscarLocalidad}, {buscarNombre}, {buscarActividad});
                    // console.warn('localidad', buscarLocalidad, buscarNombre, buscarActividad);
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
    }}

    useEffect(() => {
        filtrar()}, [buscarNombre, buscarLocalidad, buscarActividad, buscarEspecialidad])

    return(
        <View style={{flex:1, backgroundColor:'#adff2f'}}>

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
                <Text style={{fontSize:20, textAlign:"center",}}onPress={() => {
                    global.storage.remove({
                        key: 'gastronomicos'
                    });
                    Alert.alert('Gastronomico Local Borrado');
                }}>APP TURISMO</Text>                
            </View>

            {/* Segunda mitad */}
            <View style={{flex:1}}>
                {/* Listado   */}
                <View style={{flex:0.1}}>
                    <View style={{flex: 1,flexDirection:'row'}}>
                        <View style={{flex: 2, justifyContent:'center'}}>
                            <Text style={{textAlign:'center'}}> LISTADO DE GASTRONOMICO</Text>
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
                    <FlatList  
                        data={gastronomicos} // getFilteredAlojmientos IDEA
                        // data={getFilterGastronomico()} // getFilteredAlojmientos IDEA
                        initialNumToRender={20}
                        windowSize={10}
                        renderItem={({ item }) => <MostrarGastronomico eg={item} />}
                        keyExtractor={item => item.id.toString()} 
                    />
                </View>
                
            </View>       
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
    //   justifyContent: "center",
    //   alignItems: "center",
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
      textAlign: "center",
    }
  });

export default EstablecimientoGastronomicoScreen;