//importa link e stack do expo-router: essencial para comunicação da biblioteca
//Link: usado para navegar entre rotas
//Stack: permite definir configurações da tela atual na navegação em pilha
import { Link, Stack } from 'expo-router';

//importa para criar estilos nativos
import { StyleSheet } from 'react-native';

//importa componentes customizados que aplicam tema
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

//componente principal da tela "not-found"
export default function NotFoundScreen() {
  return (
    <>
      {/*configura o título da tela dentro da Stack*/}
      <Stack.Screen options={{ title: 'Oops!' }} />

      {/*Usa ThemedView como container da tela*/}
      <ThemedView style={styles.container}>

        {/*Mensagem de Erro*/}
        <ThemedText type="title">Essa não é a Tela que você procura.</ThemedText>
        
        {/*Link que leva o usuário de volta para a Home (rota "/")*/}
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Volte para a Tela Inicial.</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

//Estilos da Tela
const styles = StyleSheet.create({
  container: {
    flex: 1, //ocupa a tela inteira
    alignItems: 'center', //centraliza elementos no eixo horizontal
    justifyContent: 'center', //centraliza elementos no eixo vertical
    padding: 20, //espaçamento interno
  },
  link: {
    marginTop: 15, //espaço acima do link
    paddingVertical: 15, //espaçamento interno vertical (top e botton)
  },
});