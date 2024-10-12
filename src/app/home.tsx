import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Pressable, Alert } from "react-native";

//importanto o banco que ta disponível para toda a plicação pela sqliteprovide
//estou usando o banco de dados que ta disponipível na aplicação pelo contexto
import { useSQLiteContext } from "expo-sqlite"
import { drizzle } from "drizzle-orm/expo-sqlite";
//like par pesquisa
import { asc, eq, like } from "drizzle-orm";

//importando tudo da tabela do banco
import * as productSchema from "../database/schemas/productSchema"



//defino os tipos de dados do array do data, os quais ele vai receber
type Data = {
    id: number,
    name: string
}

export function Home() {

    const [name, setName] = useState("")
    //consultar
    const [search, setSearch] = useState("")
    const [data, setData] = useState<Data[]>([])

    

    //pego a instacia do banco
    const database = useSQLiteContext()
    //dou a conexao com  o banco e a schema que vou mexer
    //apos pegar a instacia do banco criado, eu sicronizo ele com a tebala que eu fiz ( no scheme, devo importar) e passo isso pra uma const
    const db = drizzle(database, { schema: productSchema })


    //listar 
    async function fetchProducts() {
        try {
            //db é meu url, que fez a interação do banco com a tabela
            /*faço uma (query que é uma consulta), como eu definir um
             schema, ele consegue referenciar com a tabela criada
             esse findMany pesquisa por tudo e apos tudo isso, tendo acesso
             ao banco e suas tabelas eu mando tudo pro response  e mando pra]
             const data
             */

            const response = await db.query.product.findMany({
                where: like(productSchema.product.name, `%${search}%`),
                //se fosse eq, seria exatamente igual o valor
                //com o %-% ele pequesa por (qualquer coisa com )
                orderBy: [asc(productSchema.product.name)] //ordena os nomes em ordem alfabetica
            })
            //console.log(response)
            setData(response) //jogas tudo pro array da dado

        } catch (error) {
            console.log(error)
        }
    }

    //Cadastrar um novo produto
    async function add() {
        try {
            //passo o nome (poderia ser so name) e o id nao passo pq é autoincremento
            const response = await db.insert(productSchema.product).values({
                name: name  //primeiro name é do banco e o segundo o valor que recebe
            })

            Alert.alert("Cadatrado com id" + response.lastInsertRowId)
            setName("")

            //para carregar os produtos
            await fetchProducts()

        } catch (error) {
            console.log(error)
        }
    }

    //excluir
    async function remove(id: number) {
        try {

            Alert.alert("Remover", "Deseja remover?", [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sim",
                    onPress: async () => {
                        await db
                            .delete(productSchema.product)
                            .where(eq(productSchema.product.id, id))
                        //eq(productSchema.product.id === id, (esse === é a ,)
                        //atualizar a lista
                        await fetchProducts()
                    }
                },

            ])

        } catch (error) {
            console.log(error)
        }
    }
    
    //exibir
    async function show(id:number) {
        try {
            const product = await db.query.product.findFirst({
                where: eq(productSchema.product.id,id)
            })

            if(product){
                Alert.alert(`Produto ID: ${product.id} cadastrado com o nome ${product.name}`)
            }
            
        } catch (error) {
          console.log(error)  
        }
    }

    //aqui pra poder chamar uma unica vez a função fetchProducts
    useEffect(() => {
        fetchProducts()
    }, [search]) //toda vez que o valor de search mudar ele executa o fetchProduct


    return (
        <View style={{ flex: 1, padding: 32, gap: 16 }}>
            <TextInput
                placeholder="Nome"
                style={{
                    height: 54,
                    borderWidth: 1,
                    borderRadius: 7,
                    borderColor: "#999",
                    paddingHorizontal: 16,
                }}
                onChangeText={setName} // Corrigido
                value={name} //  Mostra o valor atual do estado no campo de texto
            />


            <TextInput
                placeholder="Pesquisar"
                style={{
                    height: 54,
                    borderWidth: 1,
                    borderRadius: 7,
                    borderColor: "#999",
                    paddingHorizontal: 16,
                }}
                onChangeText={setSearch} // Corrigido
                value={search} // Corrigido
            />

            <Button title="Salvar" onPress={add} />

            {/* sao os dados que ele vai receber data={nome} */}
            <FlatList data={data}
                keyExtractor={item => String(item.id)}
                renderItem={({
                    item
                }) =>
                    <Pressable
                      style={{ padding: 16, borderWidth: 1, borderRadius: 7 }}
                      onLongPress={()=>remove(item.id)}
                      onPress={()=> show(item.id)}
                    ><Text>{item.name}</Text>
                    </Pressable>
                }
                ListEmptyComponent={() => <Text>Lista Vazia.</Text>}
                contentContainerStyle={{ gap: 16 }}
            />
        </View>
    );
}

