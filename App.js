import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import logo from "./assets/ADS.png";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";

export default function App() {
  const [suporteBiometria, setSuporteBiometria] = useState(false);
  useEffect(() => {
    (async () => {
      const temSuporte = await LocalAuthentication.hasHardwareAsync();
      setSuporteBiometria(temSuporte);
    })();
  });
  const alerta = (titulo, mensagem, btnTxt, btnFunc) => {
    if (Platform.OS === 'web') {
      return alert(`${titulo} \n ${mensagem}`)
    } else {
      return Alert.alert(titulo, mensagem[
        {
          text: btnTxt,
          onPress: btnFunc,
        }
      ])
    }
  }
  /*
  * Efetua o Login biométrico efetuando as validações.
  */
  const loginBiometrico = async () => {
    //Verificando se o dispositivo tem suporte para biometria.
    const biometriaDisponivel = await
      LocalAuthentication.hasHardwareAsync()
    //Se biometria não estiver disponivel, mostrar um alerta e voltar a pagina anterior.
    if (biometriaDisponivel)
      return alerta("Erro", "Autenticação Biometrica não disponivel", "OK", () => fallBackToDefaultLogin())

    //Verificar os tipos de biometrias disponiveis.
    //1 - Dedo, 2 - Facial, 3 - Iris.
    let biometriasSurportadas
    if (biometriaDisponivel)
      biometriasSurportadas = await LocalAuthentication, LocalAuthentication.supportedAuthenticationTypesAsync()
    //Verificar se os dados biométricos estão salvos.
    const biometriaSalva = await LocalAuthentication.isEnrolledAsync()
    if (!biometriaSalva)
      return alerta('Biometria não encontrada', 'Por favor, efetue o login de forma tradicional', 'OK', () => fallBackToDefaultLogin()
      )
    //Autentica o usuário com a biometria.
    const autenticaBiometria = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Efetue o login com a biometria',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false //Desabilita o teclado PIN
    })
    //em caso de Sucesso efetuar o login
    if (autenticaBiometria.success) {
      return alerta("Tudo certo!", "Você será redirecionado para a área reservada", "OK")
    }
  }
  const fallBackToDefaultLogin = () => {
    console.log('Não foi posssivel efetuar o login biométrico')
    console.log('Implemente o login tradicional')
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#B22222" />
      <Image
        source={logo}
        resizeMode={"contain"}
        style={{
          width: Dimensions.get("window").width * 0.5,
          height: Dimensions.get("window").height * 0.5,
        }}
      />
      <Text style={styles.titulo}>Fatec-Cripto</Text>
      <TouchableOpacity style={styles.finger}>
        <MaterialCommunityIcons
          name={suporteBiometria ? "finger-print" : "fingerprint-off"}
          size={72}
          color="#B22222"
        />
      </TouchableOpacity>
      {suporteBiometria ? (
        <Text style={style.legendas}>Desbloqueie seu dispositivo</Text>
      ) : (
        <>
          <Text style={styles.legendas}>
            Dispositivo nao tem suporte para biometria
          </Text>
          <MaterialCommunityIcons.Button
            name="login"
            size={32}
            color="#B22222"
            backgroundColor="white"
            onPress={() => alerta(' Acesso...','Aguarde enquanto lhe redirecionamos para a tela de login.')}
          >Login</MaterialCommunityIcons.Button>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEEEEE",
  },
  titulo: {
    color: "#B22222",
    fontSize: 32,
    fontWeight: 500,
  },
  finger: {
    marginTop: 16,
    padding: 32,
    borderRadius: 16,
    shadowColor: "#B22222",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.7,
    elavation: 8,
    backgroundColor: "white",
  },
  legendas: {
    fontSize: 28,
    marginTop: 13,
    marginBottom: 13,
    color: "#B22222",
    fontWeight: 400,
  },
});
