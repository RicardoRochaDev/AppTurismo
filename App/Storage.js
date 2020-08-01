import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import axios from "axios"
import ApolloClient from 'apollo-boost';
import { gql } from "apollo-boost";



const syncAlojamientos = async () => {
  const response = await axios.get('http://' + direccionIP + ':3000/alojamientos?select=*,localidades(id,nombre),categorias(id,estrellas,valor),clasificaciones(id,nombre)');
  global.storage.save({
    key: 'alojamientos',
    data: response.data,
    expires: 1000 * 60 * 60 * 24, // 1 day (1000 * 3600 * 24 milliseconds).
  });
  return response.data;
};

const syncAlojamientosFavoritos = async () => {
  global.storage.save({
    key: 'favoritosAlojamientos',
    data: [],
    expires: 1000 * 60 * 60 * 24, // 1 day (1000 * 3600 * 24 milliseconds).
  });
  return [];
};

const syncAlojamientosFavoritosFotos = async () => {
  global.storage.save({
    key: 'favoritosAlojamientosFotos', //key: 'favoritosAlojamientos',
    data: [],
    expires: 1000 * 60 * 60 * 24, // 1 day (1000 * 3600 * 24 milliseconds).
  });
  return [];
};

const syncGastronomicos = async () => {

  const client = new ApolloClient({
    uri: 'http://' + direccionIP + ':8080/v1/graphql',
  });
  const result = await client
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
        }                   `
    })

  global.storage.save({
      key: 'gastronomicos', // Note: Do not use underscore("_") in key!
      data: result.data.gastronomicos,
      expires: 1000 * 3600
  }); 
  return result.data.gastronomicos;
};

// const syncGastronomicos = async () => {

//   var gastronomicos = [];
//   const client = new ApolloClient({
//     uri: 'http://' + direccionIP + ':8080/v1/graphql',
//   });
//   client
//     .query({
//         query: gql`
//         query MyQuery {
//           gastronomicos {
//             foto
//             id
//             lat
//             lng
//             nombre
//             domicilio
//             localidade {
//               nombre
//             }
//             actividad_gastronomicos {
//               actividade {
//                 nombre
//               }
//             }
//             especialidad_gastronomicos {
//               especialidade {
//                 nombre
//               }
//             }
//           }
//         }               
//         `
//     })
//     .then(result => {
//       gastronomicos = result.data.gastronomicos});
//   global.storage.save({
//       key: 'gastronomicos', // Note: Do not use underscore("_") in key!
//       data:  gastronomicos,
//       expires: 1000 * 3600
//   }); 
//   return gastronomicos;
// };


const initStorage = () => {
  global.storage = new Storage({
    // maximum capacity, default 1000 key-ids
    size: 1000,

    // Use AsyncStorage for RN apps, or window.localStorage for web apps.
    // If storageBackend is not set, data will be lost after reload.
    storageBackend: AsyncStorage, // for web: window.localStorage

    // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
    // can be null, which means never expire.
    defaultExpires: 1000 * 3600 * 24,

    // cache data in the memory. default is true.
    enableCache: true,

    // if data was not found in storage or expired data was found,
    // the corresponding sync method will be invoked returning
    // the latest data.
    sync: {
      alojamientos: syncAlojamientos,
      favoritosAlojamientos: syncAlojamientosFavoritos,
      favoritosAlojamientosFotos: syncAlojamientosFavoritosFotos,
      gastronomicos: syncGastronomicos
    },
  });
}
// I suggest you have one (and only one) storage instance in global scope.

// for web
// window.storage = storage;

// for react native
// global.storage = storage;

const initFavoritos = () => {
    console.log('INICIO');
    global.storage.save({
      key: 'favoritosAlojamientos',
      data: [],
      expires: 1000 * 60
    });
    global.storage.save({
      key: 'favoritosAlojamientosFotos',
      data: [],
      expires: 1000 * 60
    });
}


export default initStorage; initFavoritos;