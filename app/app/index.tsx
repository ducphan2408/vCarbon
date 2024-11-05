import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  TextInput,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SelectList } from "react-native-dropdown-select-list";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import * as Location from "expo-location";

import "../assets/i18n/i18n";

import Question from "@/assets/svg/question";
import Calculator from "@/assets/svg/calculator";
import Cancel from "@/assets/svg/cancel";

import { TreeType, CalculateBiomass } from "../utils/api";

export default function Index() {
  const navigation = useNavigation();

  const { t, i18n } = useTranslation();
  const [currentLanguage, setLanguage] = useState("vi");

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [dataTreeType, setDataTreeType] = useState([]);

  const [type, setType] = useState();
  const [dbh, setDbh] = useState();
  const [number, setNumber] = useState();
  const [area, setArea] = useState(0);
  const [wbd, setWbd] = useState("100");
  const [result, setResult] = useState();
  const [currency, setCurrency] = useState();


  useEffect(() => {
    const getDataTreeType = async () => {
      const res = await TreeType();
      setDataTreeType(res);
      setLoading(false);
    };

    getDataTreeType();
  }, []);

  useEffect(() => {
    if (dataTreeType.length > 0) {
      setType(dataTreeType[0].type);
    }
  }, [dataTreeType]);

  const changeLanguage = (value) => {
    i18n
      .changeLanguage(value)
      .then(() => setLanguage(value))
      .catch((err) => console.log(err));
  };

  const Calculate = async () => {
    setLoading(true);
    const res = await CalculateBiomass(type, dbh, number, area, Number(wbd));
    setResult(new Intl.NumberFormat(["ban", "id"]).format(res.result));
    // setCurrency(new Intl.NumberFormat(["ban", "id"]).format(res.money));
    setCurrency(res.money)
    setLoading(false);
  };

  return loading ? (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <GestureHandlerRootView
      style={{
        flex: 1,
        marginHorizontal: "10%",
      }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={{ padding: 10 }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Cancel />
            </Pressable>
            <Image
              style={{ width: "100%", height: "100%" }}
              source={require("@/assets/images/dbh.png")}
            />
          </View>
        </View>
      </Modal>

      <View style={{ flexDirection: "row-reverse" }}>
        <Pressable
          onPress={() => changeLanguage("en")}
          style={{
            backgroundColor: currentLanguage === "en" ? "#0d6efd" : "#d3d3d3",
            padding: 10,
            borderRadius: 6,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ color: currentLanguage === "en" ? "white" : "black" }}>
            English
          </Text>
        </Pressable>
        <Pressable
          onPress={() => changeLanguage("vi")}
          style={{
            backgroundColor: currentLanguage === "vi" ? "#0d6efd" : "#d3d3d3",
            padding: 10,
            borderRadius: 6,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ color: currentLanguage === "vi" ? "white" : "black" }}>
            Tiếng Việt
          </Text>
        </Pressable>
      </View>

      <Text style={styles.label}>{t("tree")}</Text>
      <SelectList
        boxStyles={[styles.input]}
        inputStyles={[
          styles.button_text,
          { color: "black", fontWeight: "400" },
        ]}
        searchPlaceholder={currentLanguage == "vi" ? "Tìm kiếm..." : "Search..."}
        placeholder={currentLanguage == "vi" ? "Chọn loại cây" : "Select tree type"}
        notFoundText={currentLanguage == "vi" ? "Không có kết quả" : "No result"}
        setSelected={(val) => setType(val)}
        data={dataTreeType.map((treeType) => ({
          key: treeType.type,
          value: treeType.name,
        }))}
        defaultOption={{ key: type, value: dataTreeType.find(t => t.type === type)?.name || "" }}
        save="id"
        dropdownStyles={{ height: 150 }}
      />

      <Text style={styles.label}>{t("dbh")} (m)</Text>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={[
            styles.input,
            {
              width: "85%",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderRightWidth: 0,
            },
          ]}
          inputMode="numeric"
          value={dbh}
          onChangeText={(e) => setDbh(e)}
        />
        <Pressable
          style={styles.input_modal}
          onPress={() => setModalVisible(true)}
        >
          <Question />
        </Pressable>
      </View>

      <Text style={styles.label}>{t("wbd")} (kg/m3)</Text>
      <TextInput
        style={styles.input}
        inputMode="numeric"
        value={wbd}
        onChangeText={(e) => setWbd(e)}
      />

      <Text style={styles.label}>{t("number")} / 10m2</Text>
      <TextInput
        style={styles.input}
        inputMode="numeric"
        value={number}
        onChangeText={(e) => setNumber(e)}
      />

      <Text style={styles.label}>{t("area")} (m2)</Text>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={[
            styles.input,
            {
              width: "85%",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderRightWidth: 0,
            },
          ]}
          inputMode="numeric"
          value={area}
          onChangeText={(e) => setArea(e)}
        />
        <Pressable
          style={styles.input_modal}
          onPress={() => {
            navigation.navigate("map", { setArea });
          }}
        >
          <Calculator />
        </Pressable>
      </View>

      <Pressable
        onPress={Calculate}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#0a58ca" : "#0d6efd",
          },
          styles.button,
        ]}
      >
        <Text style={styles.button_text}>{t("cal")}</Text>
      </Pressable>

      <Text style={styles.label}>{t("res")}</Text>
      <TextInput
        style={[styles.input, styles.editable]}
        editable={false}
        value={result}
      />

      <Text style={styles.label}>{t("currency")}</Text>
      <TextInput
        style={[styles.input, styles.editable]}
        editable={false}
        value={currency}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    borderColor: "#212529",
    fontSize: 16,
    marginBottom: "2%",
  },
  input_modal: {
    height: 48,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderColor: "#0d6efd",
    fontSize: 16,
    marginBottom: "2%",
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  editable: {
    backgroundColor: "#E1E1E1",
    color: "black",
  },
  button: {
    height: 48,
    borderWidth: 0.5,
    borderRadius: 6,
    marginVertical: "2%",
    justifyContent: "center",
  },
  button_text: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: "2%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "90%",
    height: "50%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "flex-end",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
