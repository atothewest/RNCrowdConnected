import React, { useContext, useState } from "react";
import { Button, Platform, Text, View } from "react-native";
import {
  request,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from "react-native-permissions";
import type { PermissionStatus } from "react-native-permissions";
import { CrowdConnectedContext } from "../../CrowdConnected";
import styles from "./styles";

const CrowdConnectedLocationDemo = () => {
  const [running, setRunning] = useState(false);
  const { ready, crowdConnected, currentLocation } = useContext(
    CrowdConnectedContext
  );

  const requestLocationPermissionAndroid = async () => {
    let result: PermissionStatus;

    if (Platform.Version < 30) {
      // On API 29 (Android 10) and below, can request both permissions together
      // (will show in combined location dialog)
      const statuses = await requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      ]);

      result = statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
    } else {
      // On API 30 (Android 11) and above, must request permissions separately
      // otherwise both will be rejected
      result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);

      if (Platform.Version >= 31) {
        // On API 31 (Android 12) and above, we also need to request Bluetooth
        // permissions
        await requestMultiple([
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        ]);
      }
    }

    if (result === RESULTS.GRANTED) {
      crowdConnected.restart();
      crowdConnected.startNavigation();
    }
  };

  const requestLocationPermissionIOS = async () => {
    try {
      const granted = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      if (granted === RESULTS.GRANTED) crowdConnected.startNavigation();
    } catch (e) {
      console.warn(`iOS permission issue: ${e}`);
    }
  };

  const requestLocationPermission = async () => {
    setRunning(true);

    Platform.OS === "ios"
      ? await requestLocationPermissionIOS()
      : await requestLocationPermissionAndroid();
  };

  if (!ready) return null;

  return (
    <View style={styles.wrapper}>
      {running ? (
        <Button
          title="Stop Navigation"
          onPress={() => {
            crowdConnected.stopNavigation();
            setRunning(false);
          }}
        />
      ) : (
        <Button title="Start Navigation" onPress={requestLocationPermission} />
      )}
      <View style={styles.output}>
        <Text>Latitude: {currentLocation?.latitude || "-"}</Text>
        <Text>Longitude: {currentLocation?.longitude || "-"}</Text>
      </View>
    </View>
  );
};

export default CrowdConnectedLocationDemo;
