import * as React from 'react';
import { Stack } from 'expo-router';
import {
    Alert,
    StyleSheet,
    Switch,
    TouchableHighlight,
    View,
} from "react-native";

import * as ExpoMediaLibrary from "expo-media-library";

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { Ionicons } from '@expo/vector-icons';

const   ICON_SIZE = 26;

export default function PermissionsScreen() {
    const [CameraPermissionStatus, setCameraPermissionStatus] = React.useState<CameraPermissionStatus>("not-determined");
    const [microphonePermissionStatus, setMicrophonePermissionStatus] = React.useState<CameraPermissionStatus>("not-determined");

    const [mediaLibraryPermission, requestMediaLibraryPermissions] = ExpoMediaLibrary.usePermissions();

    return (
    <>
        <Stack.Screen options={{ headerTitle: "Permissions"}} />
        <ThemedView style={styles.container}>
            <View style = {styles.spacer} />
            <ThemedText type="subtitle" style={styles.subtitle}>
                Aplicativo de Câmera precisa acessar algumas permissões para funcionar corretamante em seu dispositivo.
            </ThemedText>
            
            <View style={styles.row}>
                <Ionicons name="lock-closed-outline"/>

            </View>
        </ThemedView>
    </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    subtitle: {
        textAlign: "center",
    },
    footnote: {
        fontSize: 12,
        fontWeight: "bold",
        letterSpacing: 2,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    spacer: {
        marginVertical: 8,
    },
    permissionContainer: {
        backgroundColor: "#ffffff20",
        borderRadius: 10,
        padding: 10,
        justifyContent: "space-between",
    },
    permissionText: {
        marginLeft: 10,
        flexShrink: 1,
    },
    continueButton: {
        padding: 10,
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 50,
        alignSelf: "center",
    },
});