//importa tipos para definir propriedades de componentes em React
import { ComponentProps } from "react";
//importa a biblioteca de ícones Ionicons (pacote do expo)
import { Ionicons } from "@expo/vector-icons";
//importa elementos e tipos do React Native
import {
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle,
} from "react-native";
//importa um objeto de cores customizado do projeto
import { Colors } from "@/constants/Colors";

//interface para tipar as props do botão
interface ObscuraButtonProps {
    onPress: () => void; //função chamada quando o botão é pressionado
    title?: string; //Texto opcional que pode aparecer no botão
    iconName?: ComponentProps<typeof Ionicons>["name"];
    //nome do icone da biblioteca Ionicons (ex.: "home", "camera")
    containerStyle?: StyleProp<ViewStyle>;
    //estilo adicional que pode ser passado para customizar o container
    iconSize?: number;
}

//Componente funcional que representa o botão
export default function ObscuraButton({
    onPress,
    iconName,
    title,
    containerStyle,
    iconSize,
}: ObscuraButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress} //chama a função passada ao clicar
            style={[
                styles.container, //estilo base
                {
                    backgroundColor: Colors.dark.background, //cor vinda do tema
                    borderRadius:title ? 6 : 40, //bordas arrendondadas (se tiver texto, menor radius; se for só ícone, círculo)
                    alignSelf: "flex-start", //faz o botão se ajustar ao conteúdo 
                },
                containerStyle, //permite sobreescrever estilos ao usar o componente
            ]}
        >
            {/*Renderiza o ícone apenas se a prop iconName for passada*/}
            {iconName && (
                <Ionicons name={iconName} size={iconSize ?? 28} color={"white"} />
            )}

            {/*rendenriza o título apenas se existir*/}
            {title ? (
                <Text
                    style={{
                        fontSize:14,
                        fontWeight: "600",
                        color: "white",
                    }}
                >
                    {title}
                </Text>
            ) : null}
        </TouchableOpacity>
    );
}

//estilos do container do botão
const styles = StyleSheet.create({
    container: {
        padding: 7, //espaçamento interno
        borderRadius: 40, //borda arrendondada (default, mas por ser alterada dinamicamente)
        flexDirection: "row", //Alinha ícone e texto lado a lado
        alignItems: "center", //centraliza verticalmente ícone e texto
        gap: 7, //espaçamento entre ícone e texto
    },
});