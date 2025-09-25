import {
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import {TouchableHighlight} from "react-native-gesture-handler";
import Animated, {BounceIn} from "react-native-reanimated";

//definição do limite de zoom
const MIN_ZOOM = 1;
const MAX_ZOOM = 128;
const NEUTRAL_ZOOM = 1;

//opções fixas de zoom que serão exibidas na tela
const zoomOptions = [1, 2, 3, 4, 5];

export default function zoomControls({
    setZoom, //função para atualizar o nível de zoom no componente pai
    setShowZoomControls, //função para mostrar ou ocultar controles de zoom
    zoom, //valor atual do zoom (externo)
}: {
setZoom: (zoom: number) => void;
setShowZoomControls: (show: boolean) => void;
zoom: number;
}) {
    //hook de retorno das dimensões da tela (altura/largura)
    const { width, height } = useWindowDimensions();

    //define o raio de um circulo invisivel no qual os botões são  posicionados
    const radius = Math.min(width, height - 100)* 0.35;

    //funçoes para lidar com clique nos botões de zoom
    const handleZoomPress = (zoomFactor: number) => {
        if (zoomFactor === -1) {
            //caso zoom neutro
            setZoom(NEUTRAL_ZOOM);
        } else {
            //garante que o zoom esteja dentro dos limites
            const newZoom = Math.min(Math.max(zoomFactor, MIN_ZOOM), MAX_ZOOM);
            setZoom(newZoom);
        }
    };

    return (
        <View style = {{flex: 1, padding: 10}}>
            {/*renderiza os botões de zoom dinamicamente*/}
            {zoomOptions.map((z, i) => {
                //calcula a posição angular dos botões em volta do circulo definido
                const angle = (i / zoomOptions.length / 3) * 2 * Math.PI / 2;
                const x = Math.cos(angle) * radius + 40, //posição x
                const y = Math.sin(angle) * radius + height / 4; //posição y

                return (
                    <Animated.View
                    key={i}
                    //animação com atraso crescente
                    entering={BounceIn.delay( i* 100)}
                    style={{

                    
                        position: "absolute",
                        left: x,
                        top: y,
                    }}
                    >
                        {/*botão circular para selecionar o zoom */}
                        <TouchableHighlight
                        onPress={() => handleZoomPress (z)}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: zoom === z ? "#ffffff" : "#ffffff30", //destaque se for o zoom ativo
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        >
                            <Text
                            style={{
                                color: zoom === z ? "black" : "white",
                                fontWeight: "600",
                            }}
                            >
                                {z}x
                            </Text>
                            </TouchableHighlight>
                    </Animated.View>
                );
})}
        {/*botão para fexhar os controles de zoom*/}
        <TouchableOpacity
        onPress={() => setShowZoomControls (false)}
        style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#ffffff30",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            left: 30,
            top: height / 4,
        }}
        >
            <Text style={{ color: "white", fontWeight: "600"}}></Text>
            </TouchableOpacity>
            </View>
    );
}