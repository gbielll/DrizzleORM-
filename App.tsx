//bibliotecas fundamentais 

import {drizzle} from "drizzle-orm/expo-sqlite"
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite';
import { useMigrations} from "drizzle-orm/expo-sqlite/migrator"
import migrations from "./drizzle/migrations";

import { View, Text, ActivityIndicator } from "react-native";

//apos finalizar usar essa biblioteca
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

import { Home } from './src/app/home';

//centralizar o banco de dados
const DATABASE_NAME = "database.db"
//FAÇO A INSTACIA, PASSANDO O NOME DO BANCO - DEIXE SEPARDO, AJUDA A ACESSAR DEPOIS - estou abrindo o banco 
const expoDB = openDatabaseSync(DATABASE_NAME)
const db = drizzle(expoDB)
// Aqui você pode começar a criar suas tabelas dentro do db

export default function App() {
   //passo o banco e a migrations q tem estrutura para criar o banco
   //Ele verifica se tudo está certo e aplica as instruções para que o banco de dados fique do jeito que você quer.
   const {success,error} = useMigrations(db,migrations)

   //apos finalizar -- isso adcionar um menu no secao de dev para abrir o conteudo do banco
   useDrizzleStudio(expoDB);

   if(error){
    return(
      <View style ={{flex:1, justifyContent: "center"}}>
           <Text>{error.message}</Text>
      </View>
    )
   }

   //se n deu erro e nem sucesso, ta "carregando"
   if(!success){
     <ActivityIndicator
     style ={{flex:1, justifyContent: "center"}}
     />

   }

  return (
     /* passo o nome do banco de dados que foi definido */
    <SQLiteProvider databaseName={DATABASE_NAME}>
      <Home/>
    </SQLiteProvider>
    
  );
}
