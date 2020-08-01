import React from 'react';
import {View, Text, SafeAreaView, Image, Button, StyleSheet, FlatList} from 'react-native';
//import TurismoLogo from './AwesomeProject/Img/TurismoLogo.PNG';


const alerta = () => {
    alert('You tapped the button!');
}

const FavoritoScreen = () => {

    return(
        <View style={{flex:1}}>
            
            {/* Primera mitad */}
            <View style={{flex:0.1}} >           
                <Text style={{fontSize:20, textAlign:"center"}}>APP TURISMO</Text> 
            </View>

            {/* Segunda mitad */}
            <View style={{flex:1}}>
       
                <View style={{flex:0.1}}>
                    <View style={{flex: 1,flexDirection:'row'}}>
                        <View style={{flex: 2, justifyContent:'center'}}>
                            <Text style={{textAlign:'center'}}> LISTADO DE ALOJAMIENTO</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Button
                                title="Filtro"
                                onPress={() => setModalVisible(true)}
                            />
                        </View>
                    </View>                
                </View>

                <View style={{flex:1}}>    
                    
                
                
                </View>  
            
            </View>    
        </View>
    )
}


export default FavoritoScreen;