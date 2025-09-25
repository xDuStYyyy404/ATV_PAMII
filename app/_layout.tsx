//importação de temas claro/escuro e theme provider para os componentes do app
import { DarkTheme, 
  DefaultTheme, 
  ThemeProvider 
} from '@react-navigation/native';
//hook do expo para carregar fontes personalizadas
import { useFonts } from 'expo-font';
//usado para navegação em pilha (stack navigation)
import { Stack } from 'expo-router';
//biblioteca do expo para controlar a SplashScreen (tela de abertura)
import * as SplashScreen from "expo-splash-screen";
//hook nativo do react para efeitos colaterais
import { useEffect } from 'react';
//importa a biblioteca necessária para criar animações
import 'react-native-reanimated';
//hook customizado para detectar se o dispositivo está em modo claro ou escuro
import { useColorScheme } from '@/hooks/useColorScheme';
//componente que habilita o uso de gestos (arrastar, deslizar, etc.)
import { GestureHandlerRootView } from "react-native-gesture-handler";

//impede que a splash screen desapareça automaticamente
//só será escondida manualmente quando os recursos terminarem de carregar
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  //detecta se o usuário está no tema claro ou escuro
  const colorScheme = useColorScheme();

  //carrega a fonte personalizada "SpaceMono" que está em asset/fonts
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  //assim que as fontes carregarem esconde a splash screen
  useEffect(() =>{
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  //enquanto as fontes não carregarem, não renderiza nada (retorna null)
  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    //componente raiz que garante suporte a gestos
    <GestureHandlerRootView>
      {/*aplica o tema do app - aqui está fixo no tema escuro*/}
      {/*Poderia ser condicional: value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}*/}
      <ThemeProvider value={DarkTheme}>

        {/*define as telas do app usando a navegação em pilha*/}
        <Stack>
          {/*tela inicial sem cabeçalho*/}
          <Stack.Screen name="index" options={{ headerShown: false }} />

          {/*tela de permissões exibida como modal, com cabeçalho visível*/}
          <Stack.Screen 
            name="permissions"
            options={{presentation: "modal", headerShown: true}}
          />

          {/*tela de mídia exibida como modal, mas sem cabeçalho*/}
          <Stack.Screen
            name="media"
            options={{presentation: "modal", headerShown: false }}
          />
          
          {/*tela de erro (not-found), aparece como modal*/}
          <Stack.Screen name="+not-found" options={{presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
