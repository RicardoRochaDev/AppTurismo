
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import React from 'react';
import {View, Text, SafeAreaView, Button} from 'react-native';

import HomeScreen from './App/HomeScreen'
//import AlojamientoScreen from './App/AlojamientoListScreen'
import AlojamientoListScreen from './App/AlojamientoListScreen'
import AlojamientoMapScreen from './App/AlojamientoMapScreen'
import EstablecimientoGastronomicoListScreen from './App/EstablecimientoGastronomicoListScreen'
import EstablecimientoGastronomicoMapScreen from './App/EstablecimientoGastronomicoMapScreen'
import PruebaScreen from './App/PruebaScreen'
import FavoritoListScreen from './App/FavoritoListScreen'
import FavoritoMapScreen from './App/FavoritoMapScreen'
//import Map from './App/Map'
//import MapGql from './App/MapGql'
import FichaRest from './App/FichaRest'
import FichaGql from './App/FichaGql'
import Fotos from './App/Fotos'
import Camara from './App/Camara'

import initStorage from './App/Storage'
import initFavoritos from './App/Storage'

// View = Div de html
// Text tiene que estar dentro de otro componente

initStorage();
initFavoritos();


const TabEstablecimientoGastronomico = createMaterialTopTabNavigator();

function EstablecimientoGastronomicoTabScreen() {
    return (
        <TabEstablecimientoGastronomico.Navigator lazy>
            <TabEstablecimientoGastronomico.Screen name="Lista" component={EstablecimientoGastronomicoStackListScreen} />
            <TabEstablecimientoGastronomico.Screen name="Mapa" component={EstablecimientoGastronomicoStackMapScreen} />   
        </TabEstablecimientoGastronomico.Navigator>
    );
}


const EstablecimientoGastronomicoListStack = createStackNavigator();

function EstablecimientoGastronomicoStackListScreen() {
    return (
        <EstablecimientoGastronomicoListStack.Navigator>
            <EstablecimientoGastronomicoListStack.Screen name="EstablecimientoGastronomico" component={EstablecimientoGastronomicoListScreen} />
            <EstablecimientoGastronomicoListStack.Screen name="Ficha" component={FichaGql} />
            {/* <EstablecimientoGastronomicoListStack.Screen name="Mapa" component={MapGql} /> */}
        </EstablecimientoGastronomicoListStack.Navigator>
    );
}


const EstablecimientoGastronomicoMapStack = createStackNavigator();

function EstablecimientoGastronomicoStackMapScreen() {
    return (
        <EstablecimientoGastronomicoMapStack.Navigator>
            <EstablecimientoGastronomicoMapStack.Screen name="EstablecimientoGastronomico" component={EstablecimientoGastronomicoMapScreen} />
            <EstablecimientoGastronomicoMapStack.Screen name="Ficha" component={FichaGql} />
            {/* <EstablecimientoGastronomicoMapStack.Screen name="Map" component={Map} /> */}
        </EstablecimientoGastronomicoMapStack.Navigator>
    );
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////

const TabAlojamiento = createMaterialTopTabNavigator();

function AlojamientoTabScreen() {
    return (
        <TabAlojamiento.Navigator lazy>
            <TabAlojamiento.Screen name="Lista" component={AlojamientoStackListScreen} />
            <TabAlojamiento.Screen name="Mapa" component={AlojamientoStackMapScreen} />   
        </TabAlojamiento.Navigator>
    );
}


const AlojamientoListStack = createStackNavigator();

function AlojamientoStackListScreen() {
    return (
        <AlojamientoListStack.Navigator>
            <AlojamientoListStack.Screen name="Alojamineto" component={AlojamientoListScreen} />
            <AlojamientoListStack.Screen name="Ficha" component={FichaRest} />
            {/* <AlojamientoListStack.Screen name="Mapa" component={Map} /> */}
        </AlojamientoListStack.Navigator>
    );
}

const AlojamientoMapStack = createStackNavigator();

function AlojamientoStackMapScreen() {
    return (
        <AlojamientoMapStack.Navigator>
            <AlojamientoMapStack.Screen name="Alojamineto" component={AlojamientoMapScreen} />
            <AlojamientoMapStack.Screen name="Ficha" component={FichaRest} />
            {/* <AlojamientoMapStack.Screen name="Mapa" component={Map} /> */}
        </AlojamientoMapStack.Navigator>
    );
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

const TabFavorito = createMaterialTopTabNavigator();

function FavoritoTabScreen() {
    return (
        <TabFavorito.Navigator lazy>
            <TabFavorito.Screen name="Lista" component={FavoritoStackListScreen} />
            <TabFavorito.Screen name="Mapa" component={FavoritoStackMapScreen} />   
        </TabFavorito.Navigator>
    );
}

const FavoritoListStack = createStackNavigator();

function FavoritoStackListScreen() {
    return (
        <FavoritoListStack.Navigator>
            <FavoritoListStack.Screen name="Alojamineto" component={FavoritoListScreen} />
            <FavoritoListStack.Screen name="Ficha" component={FichaRest} />
            {/* <FavoritoListStack.Screen name="Mapa" component={Map} /> */}
            <FavoritoListStack.Screen name="Fotos" component={Fotos} />
            <FavoritoListStack.Screen name="Camara" component={Camara} />
            {/* <FavoritoListStack.Screen name="Mapa" component={Ficha} /> */}
        </FavoritoListStack.Navigator>
    );
}

const FavoritoMapStack = createStackNavigator();

function FavoritoStackMapScreen() {
    return (
        <FavoritoMapStack.Navigator> 
            <FavoritoMapStack.Screen name="Alojamineto" component={FavoritoMapScreen} />
            <FavoritoMapStack.Screen name="Ficha" component={FichaRest} />
        </FavoritoMapStack.Navigator>
    );
}


//////////////////////////////////////////////////////////////////////////////////////////////////
const Tab = createBottomTabNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator lazy initialRouteName="Home">
                <Tab.Screen name="Home" component={HomeScreen}  />
                <Tab.Screen name="Alojamiento" component={AlojamientoTabScreen} />
                <Tab.Screen name="EstablecimientoGastronomico" component={EstablecimientoGastronomicoTabScreen} />
                {/* <Tab.Screen name="Prueba" component={PruebaScreen} /> */}
                <Tab.Screen name="Favoritos" component={FavoritoTabScreen} />
                {/* <Tab.Screen name="Fotos" component={Fotos} /> */}
            </Tab.Navigator>
        </NavigationContainer>    
    );
}


/*
const App2 = () => (

    <SafeAreaView>
        <View> 
                <Text style={{fontSize:20, textAlign:"center",}}>APP TURISMO</Text> 
        </View>
        <View style={{width:400, height: 300 , backgroundColor:"#7fffd4"}}>
            <Text style={{textAlign:'center'}}> PUNTOsss DE INTERES</Text>
        </View>
    </SafeAreaView>
)/*

/*
const App2 = () => (

    <SafeAreaView>
        <View> 
            <Text>Untdf</Text> 
            <Gato nombreee='carbon'>  </Gato>
            <Gato nombreee='mufasa'>  </Gato>
            <Gato nombreee='pantera'>  </Gato>

        </View>
    </SafeAreaView>
)
/*


/* Opcion 2
const App2 = () => {
    return(
    <SafeAreaView>
        <View> 
            <Text>Untdf</Text> 
        </View>
    </SafeAreaView>
    );

}*/


export default App;