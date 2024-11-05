import { Stack } from "expo-router";
import { Button, Text, Image, StyleSheet, View } from "react-native";

function LogoTitle() {
  return (
    <Image
      style={styles.image}
      source={{ uri: "https://i.ibb.co/RD7rQq4/LOGO.png" }}
    />
  );
}

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerRight: () => (
            <View>
              <Text style={styles.header}>Vcarbon Map</Text>
              <Text style={styles.sub_header}>
                View live information of trees
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="map"
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerRight: () => (
            <View>
              <Text style={styles.header}>Vcarbon Map</Text>
              <Text style={styles.sub_header}>
                View live information of trees
              </Text>
            </View>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 50,
    width: 100,
  },
  header: {
    fontWeight: "600",
    fontSize: 16,
  },
  sub_header: {
    fontSize: 14,
  },
});
