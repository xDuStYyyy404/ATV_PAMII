import * as React from "react";
import {
  StyleSheet,
  Platform,
  View,
  SafeAreaView,
  StatusBar,
  TouchableHighlight,
  Linking,
  Text,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
  useCameraPermission,
} from "react-native-vision-camera";
import { Redirect, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import ObscuraButton from "@/components/ObscuraButton";
import { FontAwesome5 } from "@expo/vector-icons";
import ZoomControls from "@/components/ZoomControls";
import { BlurView } from "expo-blur";
import ExposureControls from "@/components/ExposureControls";

// Componente principal da tela inicial
export default function HomeScreen() {
  // Hook que verifica se a permissão da câmera foi concedida
  const { hasPermission } = useCameraPermission();

  // Obtém o status da permissão do microfone
  const microphonePermission = Camera.getMicrophonePermissionStatus();

  // Estados para controlar a visibilidade dos controles de zoom e exposição
  const [showZoomControls, setShowZoomControls] = React.useState(false);
  const [showExposureControls, setShowExposureControls] = React.useState(false);

  // Referência para o componente Camera, permitindo interações como tirar fotos
  const camera = React.useRef<Camera>(null);

  // Hook que obtém a lista de câmeras disponíveis no dispositivo
  const devices = useCameraDevices();

  // Estado para definir qual câmera está em uso ('front' ou 'back')
  const [cameraPosition, setCameraPosition] = React.useState<"front" | "back">(
    "back"
  );

  // Hook que seleciona o dispositivo da câmera com base na posição (frontal ou traseira)
  const device = useCameraDevice(cameraPosition);

  // Estado para armazenar o nível de zoom, inicializado com o zoom neutro do dispositivo
  const [zoom, setZoom] = React.useState(device?.neutralZoom);

  // Estado para armazenar o nível de exposição
  const [exposure, setExposure] = React.useState(0);

  // Estado para controlar o flash ('on' ou 'off')
  const [flash, setFlash] = React.useState<"off" | "on">("off");

  // Estado para controlar a lanterna ('on' ou 'off')
  const [torch, setTorch] = React.useState<"off" | "on">("off");

  // Redireciona para a tela de permissões se a permissão da câmera ou do microfone não estiver garantida
  const redirectToPermissions =
    !hasPermission || microphonePermission === "not-determined";

  // Hook do Expo Router para navegação entre telas
  const router = useRouter();

  // Função assíncrona para tirar uma foto
  const takePicture = async () => {
    try {
      // Lança um erro se a referência da câmera for nula
      if (camera.current == null) throw new Error("Camera ref is null!");

      console.log("Taking photo...");

      // Tira a foto usando a câmera e as configurações atuais
      const photo = await camera.current.takePhoto({
        flash: flash, // Usa o estado atual do flash
        enableShutterSound: false, // Desabilita o som do obturador
      });

      // Navega para a tela de mídia, passando o caminho e o tipo da foto como parâmetros
      router.push({
        pathname: "/media",
        params: { media: photo.path, type: "photo" },
      });
    } catch (e) {
      console.error("Failed to take photo!", e);
    }
  };

  // Se o redirecionamento for necessário, o componente retorna o Redirect
  if (redirectToPermissions) return <Redirect href={"/permissions"} />;

  // Se nenhum dispositivo de câmera for encontrado, retorna um componente vazio
  if (!device) return <></>;

  // Renderiza a interface principal da câmera
  return (
    <>
      {/* Define a cor da barra de status do sistema */}
      <StatusBar barStyle={"light-content"} />

      {/* Container principal usando SafeAreaView para evitar a área de recorte (notch) */}
      <SafeAreaView style={styles.container}>
        {/* Área de visualização da câmera */}
        <View style={{ flex: 2, borderRadius: 10, overflow: "hidden" }}>
          {/* Componente principal da câmera */}
          <Camera
            ref={camera} // Referência para a câmera
            style={{ flex: 1 }} // Ocupa todo o espaço disponível no container
            photo={true} // Habilita a funcionalidade de tirar fotos
            zoom={zoom} // Aplica o nível de zoom atual
            device={device!} // Usa o dispositivo de câmera selecionado
            isActive={true} // Mantém a câmera ativa
            resizeMode="cover" // Ajusta a visualização para cobrir todo o espaço
            preview={true} // Habilita o preview em tempo real
            exposure={exposure} // Aplica o nível de exposição atual
            torch={torch} // Ativa/desativa a lanterna
          />

          {/* Efeito de blur para o texto de informações */}
          <BlurView
            intensity={100}
            tint="dark"
            style={{
              flex: 1,
              position: "absolute",
              bottom: 0,
              right: 0,
              padding: 10,
            }}
            experimentalBlurMethod="dimezisBlurView"
          >
            {/* Texto que mostra os valores atuais de exposição e zoom */}
            <Text style={{ color: "white" }}>
              Exposure: {exposure} | Zoom: x{zoom}
            </Text>
          </BlurView>
        </View>

        {/* Renderização condicional de controles de zoom, exposição ou botões principais */}
        {showZoomControls ? (
          // Renderiza os controles de zoom
          <ZoomControls
            setZoom={setZoom}
            setShowZoomControls={setShowZoomControls}
            zoom={zoom ?? 1}
          />
        ) : showExposureControls ? (
          // Renderiza os controles de exposição
          <ExposureControls
            setExposure={setExposure}
            setShowExposureControls={setShowExposureControls}
            exposure={exposure}
          />
        ) : (
          // Renderiza os botões principais da interface
          <View style={{ flex: 1, padding: 10 }}>
            {/* Seção superior com informações técnicas da câmera */}
            <View style={{ flex: 0.7 }}>
              <ThemedText>Max FPS: {device.formats[0].maxFps}</ThemedText>
              <ThemedText>
                Width: {device.formats[0].photoWidth} Height:{" "}
                {device.formats[0].photoHeight}
              </ThemedText>
              <ThemedText>Camera: {device.name}</ThemedText>
            </View>

            {/* Seção intermediária com botões de funcionalidades */}
            <View
              style={{
                flex: 0.7,
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              {/* Botão para ativar/desativar a lanterna */}
              <ObscuraButton
                iconName={torch === "on" ? "flashlight" : "flashlight-outline"}
                onPress={() => setTorch((t) => (t === "off" ? "on" : "off"))}
              />

              {/* Botão para ativar/desativar o flash */}
              <ObscuraButton
                iconName={flash === "on" ? "flash-outline" : "flash-off-outline"}
                onPress={() => setFlash((f) => (f === "off" ? "on" : "off"))}
              />

              {/* Botão para alternar entre câmera frontal e traseira */}
              <ObscuraButton
                iconName="camera-reverse-outline"
                onPress={() =>
                  setCameraPosition((p) => (p === "back" ? "front" : "back"))
                }
              />

              {/* Botão para abrir a galeria de fotos nativa */}
              <ObscuraButton
                iconName="image-outline"
                onPress={() => {
                  const link = Platform.select({
                    ios: "photos-redirect://",
                    android: "content://media/external/images/media",
                  });
                  Linking.openURL(link!);
                }}
              />

              {/* Botão para navegar para a tela de configurações */}
              <ObscuraButton
                iconName="settings-outline"
                onPress={() => router.push("/_sitemap")}
              />
            </View>

            {/* Seção inferior com o botão de captura e controles adicionais */}
            <View
              style={{
                flex: 1.1,
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              {/* Botão para mostrar/esconder os controles de zoom */}
              <ObscuraButton
                iconSize={40}
                title="+/-"
                onPress={() => setShowZoomControls((s) => !s)}
              />

              {/* Botão de captura, com um ícone de ponto grande */}
              <TouchableHighlight onPress={takePicture}>
                <FontAwesome5 name="dot-circle" size={55} color={"white"} />
              </TouchableHighlight>

              {/* Botão para mostrar/esconder os controles de exposição */}
              <ObscuraButton
                iconSize={40}
                title="1x"
                onPress={() => setShowExposureControls((s) => !s)}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

// Estilos da aplicação usando StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Adiciona padding no topo para Android para evitar a barra de status
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});