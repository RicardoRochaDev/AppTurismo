import React, { useState }  from 'react';
import {View, Text, SafeAreaView, Image, Button, StyleSheet, Switch} from 'react-native';
//import TurismoLogo from './AwesomeProject/Img/TurismoLogo.PNG';

import {Picker} from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/Ionicons';

const cajitasStyle =  {
    width: 25
}
//C:\Users\Ricky\Desktop\project\AwesomeProject\Img\TurismoLogo.PNG
// View = Div de html
// Text tiene que estar dentro de otro componente
//<Image source={TurismoLogo}> </Image>

const alerta = () => {
    alert('You tapped the button!');
}

const PruebaScreen = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    
    let [lenguaje, setLenguaje] = useState('')
    lenguaje= 'java'

    return(
        <View style={style.principal}>
            <View style={{flex:0.5}}>
                <View style={{flex: 1,flexDirection:'row'}}>
                    <View style={{flex: 1, backgroundColor:'yellow'}}>
                        
                    </View>
                    <View style={{flex: 1, backgroundColor:'orange'}}>

                    </View>
                </View>
            </View>
            <View style={{flex:2, backgroundColor:'red'}}>
                {/* <Image
                    style={{width:100, height:150}}
                    // source={require('C:/Users/Ricky/Pictures/1fc3b1976a3e94e81627369776aa4e50.jpg')}
                    source={require('C:/Users/Ricky/Desktop/project/AwesomeProject/Img/1fc3b1976a3e94e81627369776aa4e50.jpg')}
                    //source={{uri:'C:/Users/Ricky/Desktop/project/AwesomeProject/Img/1fc3b1976a3e94e81627369776aa4e50.jpg'}} //no funciona
                /> */}
                <Button onPress={alerta} title="boton" />
                {/*<Button onPress={alerta()} title="Learn More" />            sucede algo diferente al recargar la app*/}
                <Picker
                    //selectedValue={estado.language}
                    style={{height: 50, width: 150}}
                    onValueChange={(itemValue, itemIndex) =>
                        setLenguaje(itemValue)
                    }
                    mode= 'dialog'
                    >
                    <Picker.Item label="Java" value="java" />
                    <Picker.Item label="JavaScript" value="js" />
                    <Picker.Item label="Python" value="pt" />
                </Picker>

            </View>
            <View style={{flex:1, backgroundColor:'blue'}}>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                >
                </Switch>
                <Icon name="ios-person" size={50} color="#4F8EF7" />
            </View>
            
        </View>
    )
}

const style= StyleSheet.create({
    principal:{
        flex: 1,
        backgroundColor:'green'
    }

});

export default PruebaScreen;