import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
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
  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="red" />
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
          color="red"
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
            color="red"
            backgroundColor="white"
          />
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
    color: "red",
    fontSize: 32,
    fontWeight: 500,
  },
  finger: {
    marginTop: 16,
    padding: 32,
    borderRadius: 16,
    shadowColor: "red",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.7,
    elavation: 8,
    backgroundColor: "white",
  },
  legendas: {
    fontSize: 28,
    marginTop: 13,
    color: "red",
    fontWeight: 400,
  },
});
