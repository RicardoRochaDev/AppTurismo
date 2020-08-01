import React, { useState ,useEffect }  from 'react';
import {View, Text, SafeAreaView, Image, StyleSheet, FlatList, Modal, TextInput, Alert} from 'react-native';

import { Divider , Card, ListItem, Button , Input } from 'react-native-elements';

//import Icon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';


const FavoritoScreen = ({navigation}) => {
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [buscarNombre, setBuscarNombre] = React.useState('');
    const [filtroNombre, setFiltroNombre] = React.useState('');

    const [reset, setReset]= useState(0);
    const [resetFavoritos, setResetFavoritos]= useState(0);
    const [resetFavoritosFotos, setResetFavoritosFotos]= useState(0);
    

    // const [favoritos, setFavoritos]= useState({
    //     'alojamientos': [],
    //     'establecimientoGastronomico':[]
    // });

    //console.log('fuera ',global.favoritos.alojamientos);

    const carga = async () => {       
        var favoritos= await global.storage.load({key:'favoritosAlojamientos'});
        console.log(' pase por aqui');
        //var dato= await global.storage.load({key:'dato'});
        setData(favoritos);
        console.log('favoritos: ', favoritos);
    } 

    useEffect(() => {
        carga();
    },[reset, resetFavoritos, resetFavoritosFotos])
    

 
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log('FOCUS');
            carga();
        });
    
        return unsubscribe;
        }, [navigation]);
    
   

    const filtrar = () => {
        //console.warn('ENTRADA', {buscarNombre}, {buscarLocalidad}, {buscarActividad});
        if (buscarNombre !== '') {
            var alojamientoFiltrado = data.filter(aloj => aloj.nombre == buscarNombre);
            setData(alojamientoFiltrado);
        } 
    }

    useEffect(() => {
        filtrar()}, [buscarNombre])


    const cargaFoto = async ( id ) => {
        var favoritos= await global.storage.load({key:'favoritosAlojamientosFotos'});
        console.log(favoritos);
        var listaFavoritosFoto= [];

        favoritos.forEach((elemento) => {
            if (elemento.id == id) {
                listaFavoritosFoto.push(elemento.url);
            }
            //console.log(elemento);
        });
        
        //console.log('EAEAEAEA ',listaFavoritosFoto);
        navigation.navigate('Fotos', { listaURL: listaFavoritosFoto });
    }

    const cargaGaleria = async ( id ) => {
        return(
            ImagePicker.openPicker({
                width: 400,
                height: 800,
                cropping: true
              }).then(image => {
                console.log(image.path);
                console.log(id);
                const guardarEnFavoritos = async () => {
                    var listaFavoritosFotos=  await global.storage.load({key:'favoritosAlojamientosFotos'});
                    var seleccionFoto= {
                        'id': id,
                        'url': image.path
                    }
                    listaFavoritosFotos.push(seleccionFoto);
                    global.storage.save({
                        key: 'favoritosAlojamientosFotos', // Note: Do not use underscore("_") in key!
                        data: listaFavoritosFotos,
                        expires: 1000 * 3600
                    });    
                }
                guardarEnFavoritos();
              }).catch(error => {
                  console.log(error);
              })
        )
    }


    const MostrarAlojamiento = ({ aloj }) => {

        //console.log('dentro ',global.favoritos.alojamientos);
        return (
            <Card title={aloj.nombre} titleStyle={{fontSize:16}}> 
                <View key={aloj.id} style={{flexDirection:'row', flex:1}}>
                    <Image            
                        style={{width:100, height:150}}     
                        resizeMode="cover"
                        source={{ uri: aloj.foto }}
                    />

                    <View style={{flexDirection:'column', flex:1}}>
                        <View style={{justifyContent: 'space-around', flexDirection:'row', flex:1}}>
                            <Button
                                title="Ficha"
                                onPress={() => navigation.navigate('Ficha', { aloj: aloj })}
                            />
                            {/* <Button
                                title="Mapa"
                                onPress={() => navigation.navigate('Mapa', { aloj: aloj })}
                                /> */}
                            <Button
                                title="Fotos"
                                onPress={() => cargaFoto(aloj.id) }
                                />   
                        </View> 
                        <View style={{flex:1}}>
                            <View style={{justifyContent: 'space-around', flexDirection:'row', flex:1}}>
                                <Button
                                    icon={<Icon name="add-a-photo" size={40} color="blue" /> }
                                    type='clear'
                                    onPress={() => navigation.navigate('Camara', { id: aloj.id})}
                                />    
                                <Button
                                    icon={<Icon name="photo" size={40} color="blue" /> }
                                    type='clear'
                                    onPress={() => { cargaGaleria(aloj.id) }}
                                />  
                            </View> 
                        </View>
                    </View>
                    
                      
                </View>             
            </Card> 
        );
    }
    
    function listaVacia() {
        return(
            <View>
                <Image
                    style={{flex:1, width:400, height:400, resizeMode: 'contain'}}
                    source={{uri:'https://news.airbnb.com/wp-content/uploads/sites/4/2020/04/PJMPHOTO18Q335-Society-Hotel-01689_JL1.jpg'}} //no funciona
                    
                />
            </View>
        );
    } 

    // useEffect(() => {
    //     setFavoritos(global.favoritos.alojamientos);

    // }, [global.favoritos.alojamientos, global.favoritos.establecimientoGastronomico])

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

                    <Button
                        title="Filtrar"
                        // onPress={setModalVisible(false)} //tira error. 
                        onPress={() => {
                            setBuscarNombre(filtroNombre);
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
       
                <View style={{flex:0.2}}>
                    <View style={{flex: 1,flexDirection:'row'}}>
                        <View style={{flex: 2, justifyContent:'center'}}>
                            <Text style={{textAlign:'center'}}> LISTADO DE ALOJAMIENTO</Text>
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
                                }}
                            />
                        </View>
                    </View>
                    <View style={{flex: 1,flexDirection:'row', marginLeft: 15}}>
                        <Button
                            title="Reset Favorito"
                            onPress={() => {
                                global.storage.remove({
                                    key: 'favoritosAlojamientos'
                                });
                                setResetFavoritos(resetFavoritos + 1)
                                Alert.alert('Favoritos Borrados');
                            }}
                            />
                        <Button
                            title="Reset Fotos"
                            onPress={() => {
                                global.storage.remove({
                                    key: 'favoritosAlojamientosFotos'
                                });
                                setResetFavoritosFotos(resetFavoritosFotos + 1)
                                Alert.alert('Fotos Borrados');
                            }}
                        />                  
                    </View>      
                </View>

                <View style={{flex:1}}>          
                    <FlatList
                        data={data}
                        initialNumToRender={20}
                        windowSize={10}
                        ListEmptyComponent={listaVacia}
                        renderItem={({ item }) => <MostrarAlojamiento aloj={item} />}
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

export default FavoritoScreen;


    // const data = [
    //     {
    //         "id": 1,
    //         "nombre": "Hotel Las Hayas",
    //         "domicilio": "Luis F. Martial  1650",
    //         "lat": -54.807243,
    //         "lng": -68.352315,
    //         "foto": "https://suit.tur.ar/archivos/read/1445/mdc",
    //         "clasificacion_id": 8,
    //         "categoria_id": 5,
    //         "localidad_id": 1
    //         },
    //         {
    //         "id": 3,
    //         "nombre": "Hotel Ushuaia",
    //         "domicilio": "Lasserre  933",
    //         "lat": -54.797906,
    //         "lng": -68.310884,
    //         "foto": "https://suit.tur.ar/archivos/read/11/mdc",
    //         "clasificacion_id": 8,
    //         "categoria_id": 4,
    //         "localidad_id": 1
    //         },
    //         {
    //         "id": 4,
    //         "nombre": "Hotel Canal Beagle",
    //         "domicilio": "Av. Maipú  547",
    //         "lat": -54.807438,
    //         "lng": -68.30554,
    //         "foto": "https://suit.tur.ar/archivos/read/16/mdc",
    //         "clasificacion_id": 8,
    //         "categoria_id": 4,
    //         "localidad_id": 1
    //         },
    //    ];

    // const data = []