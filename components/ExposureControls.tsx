import React from "react";
import {
  Platform,               // Usado para detectar se estamos em iOS ou Android
  Text,
  TouchableOpacity,       // Botão usado para o "X" de fechar
  useWindowDimensions,    // Hook que fornece largura/altura atuais da janela (reage a rotações)
  View,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler"; // Botões circulares com feedback visual
import Animated, { BounceIn } from "react-native-reanimated"; // animações de entrada

// -> Opções de exposure separadas por plataforma:
//    - Android: tipicamente exp uses valores maiores (ex.: passos em centésimos/valor específico da API)
//    - iOS: costuma usar EV em faixa menor (-2 a +2)
const exposureOptionsAndroid = [-10, -5, 0, 5, 10];
const exposureOptionsIOS = [-2, -1, 0, 1, 2];

// Escolhe as opções adequadas conforme a plataforma atual
const exposureOptions =
  Platform.OS === "android" ? exposureOptionsAndroid : exposureOptionsIOS;

// Componente principal
export default function ExposureControls({
  setExposure,               // função vinda do pai para aplicar o valor de exposure na câmera
  setShowExposureControls,   // função do pai para mostrar/ocultar este painel
  exposure,                  // valor atual do exposure (controlado pelo pai)
}: {
  setExposure: (exposure: number) => void;
  setShowExposureControls: (show: boolean) => void;
  exposure: number;
}) {
  // Pega dimensões da janela para calcular posições "dinâmicas"
  const { width, height } = useWindowDimensions();

  /* 
    radius: tamanho do "arco/círculo" invisível onde os botões serão posicionados.
    Usa Math.min(width, height - 100) para garantir que caiba tanto em retrato quanto em paisagem.
    Multiplica por 0.35 para reduzir o raio relativo ao menor lado disponível.
    Observação: se height for muito pequeno (<100) o radius pode ficar estranho — pode-se clamar/validar.
  */
  const radius = Math.min(width, height - 100) * 0.35;

  // Função chamada quando um botão de exposure é pressionado
  const handleExposurePress = (exposureValue: number) => {
    // Simplesmente encaminha para o setter do pai
    setExposure(exposureValue);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* 
        Mapeia cada opção de exposure e renderiza um botão posicionado ao longo de um arco.
        Cada botão tem animação de entrada com atraso escalonado para efeito "stagger".
      */}
      {exposureOptions.map((exp, i) => {
        /*
          Cálculo do ângulo:
            (i / exposureOptions.length / 3) * 2 * Math.PI - Math.PI / 2

          Explicação:
            - (i / exposureOptions.length) normaliza i entre 0 e ~1 (exclusive para o último item)
            - dividir por 3 (i/len/3) significa que o arco coberto será aproximadamente 1/3 de uma volta completa.
              Como 2*PI é uma volta completa (360°), multiplicar por 2*PI e dividir por 3 resulta em ~120° de arco.
            - Subtrair Math.PI/2 (90°) "rotaciona" o início para cima (posição aproximada das 12 horas),
              então o arco vai de -90° até -90° + 120° (ou seja, do topo para a direita).
            - Resultado final: os botões são distribuídos num arco de ~120° no lado direito da tela.
        */
        const angle =
          (i / exposureOptions.length / 3) * 2 * Math.PI - Math.PI / 2;

        /* 
          Conversão polares -> cartesianas para posicionar os botões:
            x = width - Math.cos(angle) * radius - 90
            y = Math.sin(angle) * radius + height / 4

          Observações:
            - Como `left` no estilo é medido a partir da borda esquerda, para "ancorar à direita"
              usamos width - (offset) para empurrar para a extremidade direita.
            - O `- 90` em x é um deslocamento extra para ajustar a distância até a borda direita (tuning visual).
            - y usa height/4 como base vertical, movendo o conjunto aproximadamente para a parte superior/central.
            - Esses valores (`-90`, `height/4`) são “tunning” estético — podem precisar de ajuste
              para dispositivos com notch / barras de navegação.
        */
        const x = width - Math.cos(angle) * radius - 90; // posição horizontal (medida do lado esquerdo da tela)
        const y = Math.sin(angle) * radius + height / 4; // posição vertical

        return (
          <Animated.View
            key={i} // chave única por item
            entering={BounceIn.delay(i * 100)} // animação de entrada: cada botão entra com pequeno atraso
            style={{
              position: "absolute", // posicionamento absoluto para usar left/top calculados
              left: x,
              top: y,
            }}
          >
            {/* 
              TouchableHighlight fornece feedback visual tipo "pressionado" (fundo escurece).
              É usado aqui para criar botões circulares touch-friendly.
            */}
            <TouchableHighlight
              onPress={() => handleExposurePress(exp)} // ao tocar, seta o exposure correspondente
              style={{
                width: 50,
                height: 50,
                borderRadius: 25, // torna o botão circular
                backgroundColor: exposure === exp ? "#ffffff" : "#ffffff30",
                // - se este valor de exposure coincide com o atual, fundo branco sólido (destacado)
                // - caso contrário, fundo branco semi-transparente
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  // cor do texto depende de seleção para contraste
                  color: exposure === exp ? "black" : "white",
                  fontWeight: "600",
                }}
              >
                {/* 
                  Formata o texto adicionando '+' para valores positivos.
                  Ex.: +1, 0, -1
                */}
                {exp > 0 ? `+${exp}` : exp}
              </Text>
            </TouchableHighlight>
          </Animated.View>
        );
      })}

      {/* 
        Botão "X" para fechar o painel de exposure.
        Usa TouchableOpacity — um tipo de botão simples com feedback de opacidade.
      */}
      <TouchableOpacity
        onPress={() => setShowExposureControls(false)} // fecha via callback do pai
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#ffffff30",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          right: 30,           // ancorado à direita (aproximadamente alinhado com os botões)
          top: height / 4,     // mesma linha base vertical dos botões
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>X</Text>
      </TouchableOpacity>
    </View>
  );
}
 