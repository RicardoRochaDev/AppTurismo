import React, { useEffect, useState } from 'react';
import {View, Text, ScrollView, Alert, FlatList, Image, StyleSheet, Modal, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import { Divider , Card, ListItem, Button , Input } from 'react-native-elements';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import axios from "axios"

//Para usar esta clave en tu aplicación, transfiérela con el parámetro key=API_KEY
//AIzaSyBu2yL17HK5_-rFNxpyUJAxcshF5Sd125k

// ID Google app-turismo-278721

const AlojamientoListScreen = ({navigation}) => {
    //const navigation = useNavigation()
    const [isError, setIsError]= useState(false);
    const [isFetching, setIsFetching]= useState(false);
    const [reset, setReset]= useState(0);


    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [buscarNombre, setBuscarNombre] = React.useState('');
    const [buscarLocalidad, setBuscarLocalidad] = React.useState('');
    const [buscarCategoria, setBuscarCategoria] = React.useState('');
    const [buscarClasificacion, setBuscarClasificacion] = React.useState('');
    
    const [filtroNombre, setFiltroNombre] = React.useState('');
    const [filtroLocalidad, setFiltroLocalidad] = React.useState('');
    const [filtroCategoria, setFiltroCategoria] = React.useState('');
    const [filtroClasificacion, setFiltroClasificacion] = React.useState('');

    //const [cantidadAlojamientos, setCantidadAlojamientos] = useState(0);

    useEffect(() => {
        
        const fetchData = async () => {
            setIsError(false);
            setIsFetching(true);
            try {
                const localData = await global.storage.load({key:'alojamientos'});
                setData(localData);
                // console.warn(localData);
                //const response = await axios.get('http://' + direccionIP + ':3000/alojamientos');
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
                console.warn(error, 'Alojamiento LIST Scren');
                setIsError(true);
            }
            setIsFetching(false);
            // setCantidadAlojamientos(data.length);
            // console.log('dataL:', cantidadAlojamientos);
        };       

        fetchData();     
    }, [reset]);  
    

    const agregarFavoritos = async ( aloj ) => {
        //console.log('ALOJ', aloj);

        const listaFavoritos=  await global.storage.load({key:'favoritosAlojamientos'});
        console.log('LISTA LOAD', listaFavoritos);

        var pos = 0;
        var tamanio = listaFavoritos.length; 
        var encontrado= false;
        while ((encontrado == false) && (pos < tamanio)){
            if (listaFavoritos[pos].id == aloj.id){
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
    }

    function MostrarAlojamiento({ aloj }) {
        //console.warn(key);
        return (
            <Card key={aloj.id.toString()} title={aloj.nombre} titleStyle={{fontSize:16}}> 
                <View style={{flexDirection:'row', flex:1}}>
                    <Image            
                        style={{width:100, height:150}}     
                        resizeMode="cover"
                        source={{ uri: aloj.foto }}
                    />
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
                            icon={<Icon name="favorite" size={25} color="blue" />   }
                            type='clear'
                            onPress={() => {
                                //console.log('BOTON ', aloj);
                                agregarFavoritos(aloj);
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
            var alojamientoFiltrado = data.filter(aloj => aloj.nombre == buscarNombre);
            setData(alojamientoFiltrado);
            //setCantidadAlojamientos(data.length);
        } 
        else{
            if (buscarLocalidad !== '') {
                var alojamientoFiltrado = data.filter(aloj => aloj.localidades.nombre == buscarLocalidad);
                //setData(alojamientoFiltrado);
            } 
            else{
                if (buscarCategoria !== '') {
                    var alojamientoFiltrado = data.filter(aloj => aloj.categorias.valor == buscarCategoria);
                    setData(alojamientoFiltrado);  
                    //setCantidadAlojamientos(data.length); 
                }
                else{
                    if (buscarClasificacion !== '') {
                        var alojamientoFiltrado = data.filter(aloj => aloj.clasificaciones.nombre == buscarClasificacion);
                        setData(alojamientoFiltrado);   
                        //setCantidadAlojamientos(data.length);
                    }
                }
            }   
        }
    }

    useEffect(() => {
        filtrar()}, [buscarNombre, buscarLocalidad, buscarCategoria, buscarClasificacion])


    //const alojamientoFiltrado = data.filter(aloj => aloj.id == 1);

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
                        //style={{marginTop:20, marginBottom:50}}
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
                <Text style={{fontSize:20, textAlign:"center"}} onPress={() => {
                    global.storage.remove({
                        key: 'alojamientos'
                    });
                    Alert.alert('Alojamientos Local Borrado');
                }}>APP TURISMO</Text> 
            </View>

            {/* Segunda mitad */}
            <View style={{flex:1}}>
       
                <View style={{flex:0.1}}>
                    <View style={{flex: 1,flexDirection:'row'}}>
                        <View style={{flex: 2, justifyContent:'center'}}>
                            <Text style={{textAlign:'center'}}> LISTADO DE ALOJAMIENTO</Text>
                            {/* <Text style={{textAlign:'center'}}> LISTADO DE ALOJAMIENTO ({cantidadAlojamientos})</Text> */}
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

                    <FlatList
                        data={data}
                        initialNumToRender={20}
                        windowSize={10}
                        renderItem={({ item}) => <MostrarAlojamiento aloj={item}/>}
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

export default AlojamientoListScreen;