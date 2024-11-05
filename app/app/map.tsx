import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import * as turf from "@turf/turf";
import * as Location from "expo-location";

import "../assets/i18n/i18n";

export default function Map() {
  const route = useRoute();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);

  // const location = route.params.location;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const setArea = route.params.setArea;
  // console.log(route)

  const [polygons, setPolygons] = useState([]); // State to store multiple polygons
  const [currentPolygon, setCurrentPolygon] = useState([]); // State for the current polygon
  const [totalArea, setTotalArea] = useState(0); // State to store the total area

  useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLoading(false);
      console.log(location);
    })();
  }, []);

  const handleMapPress = (e) => {
    const newCoordinate = e.nativeEvent.coordinate;
    setCurrentPolygon([...currentPolygon, newCoordinate]);
  };

  const startNewPolygon = () => {
    if (currentPolygon.length > 0) {
      // Add the current polygon to the list and calculate its area
      const closedCoordinates = [...currentPolygon, currentPolygon[0]];
      const polygon = turf.polygon([
        closedCoordinates.map((coord) => [coord.longitude, coord.latitude]),
      ]);
      const area = turf.area(polygon);

      setPolygons([...polygons, closedCoordinates]);
      setTotalArea(totalArea + area);
      setCurrentPolygon([]);
    }
  };

  const clearAllPolygons = () => {
    setPolygons([]);
    setCurrentPolygon([]);
    setTotalArea(0);
  };

  const finalizePolygon = () => {
    if (currentPolygon.length < 3) {
      alert(t("area-err"));
      return;
    }

    // Close the current polygon by adding the first coordinate at the end
    const closedCoordinates = [...currentPolygon, currentPolygon[0]];
    const polygon = turf.polygon([
      closedCoordinates.map((coord) => [coord.longitude, coord.latitude]),
    ]);
    const area = turf.area(polygon) / 3;

    setPolygons([...polygons, closedCoordinates]);
    setTotalArea(totalArea + area);
    setArea((totalArea + area).toFixed(0));
    setCurrentPolygon([]);
  };

  return loading ? (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          mapType="satellite"
          initialRegion={{
            latitude: location.coords.latitude || 16.127795,
            longitude: location.coords.longitude || 108.117295,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          onPress={handleMapPress}
        >
          {/* Render all polygons */}
          {polygons.map((polygon, index) => (
            <Polygon
              key={index}
              coordinates={polygon}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          ))}
          {/* Render the current polygon */}
          {currentPolygon.length > 0 && (
            <Polygon
              coordinates={currentPolygon}
              strokeColor="#00F"
              fillColor="rgba(0,0,255,0.3)"
              strokeWidth={1}
            />
          )}
          {/* Render markers for all polygons */}
          {[...polygons.flat(), ...currentPolygon].map((coordinate, index) => (
            <Marker key={index} coordinate={coordinate} />
          ))}
        </MapView>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Pressable style={styles.button} onPress={clearAllPolygons}>
            <Text style={styles.buttonText}>{t("delete")}</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={startNewPolygon}>
            <Text style={styles.buttonText}>{t("draw")}</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={finalizePolygon}>
            <Text style={styles.buttonText}>{t("area")}</Text>
          </Pressable>
        </View>
        <Text style={styles.areaText}>
          {t("area-res")} {totalArea.toFixed(0)} m2
        </Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0d6efd",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    width: "30%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  areaText: {
    position: "absolute",
    bottom: 70,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
});
