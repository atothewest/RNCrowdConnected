import React, { useEffect, useState } from "react";
import { NativeEventEmitter, NativeModules, NativeModule } from "react-native";
export interface CrowdConnectedNativeMethods {
  restart: () => void;
  startNavigation: () => void;
  stopNavigation: () => void;
  setAlias: (alias: string) => void;
}

export type CrowdConnectedNativeModule = NativeModule &
  CrowdConnectedNativeMethods & {
    start: (appKey: string, appToken: string, appSecret: string) => void;
  };

declare module "react-native" {
  interface NativeModulesStatic {
    RNCrowdConnected: CrowdConnectedNativeModule;
  }
}

const eventEmitter = new NativeEventEmitter(NativeModules.RNCrowdConnected);
const { RNCrowdConnected } = NativeModules;

export type Location = { latitude: number; longitude: number };

type CrowdConnectContextProps = {
  ready: boolean;
  crowdConnected: CrowdConnectedNativeMethods;
  currentLocation?: Location;
};

export const CrowdConnectedContext =
  React.createContext<CrowdConnectContextProps>({
    ready: false,
    crowdConnected: {
      restart: () => null,
      startNavigation: () => null,
      stopNavigation: () => null,
      setAlias: () => null,
    },
  });

type CrowdConnectProviderProps = {
  appKey: string;
  appToken: string;
  appSecret: string;
  children: React.ReactNode;
};

const CrowdConnectedProvider = (props: CrowdConnectProviderProps) => {
  const [ready, setReady] = useState(false);
  const [location, setLocation] = useState<Location>();

  useEffect(() => {
    eventEmitter.addListener("onReady", () => {
      setReady(true);
    });

    eventEmitter.addListener(
      "onLocationUpdated",
      (event: { latitude: string; longitude: string }) => {
        setLocation({
          latitude: parseFloat(event.latitude),
          longitude: parseFloat(event.longitude),
        });
      }
    );

    RNCrowdConnected.start(props.appKey, props.appToken, props.appSecret);

    return () => {
      // always ensure navigation is stopped if component is unmounted
      RNCrowdConnected.stopNavigation();
    };
  }, []);

  const stopNavigation = () => {
    setLocation(undefined);
    RNCrowdConnected.stopNavigation();
  };

  return (
    <CrowdConnectedContext.Provider
      value={{
        ready,
        crowdConnected: {
          restart: RNCrowdConnected.restart,
          setAlias: RNCrowdConnected.setAlias,
          startNavigation: RNCrowdConnected.startNavigation,
          stopNavigation,
        },
        currentLocation: location,
      }}
    >
      {props.children}
    </CrowdConnectedContext.Provider>
  );
};

export default CrowdConnectedProvider;
