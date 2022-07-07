import React from "react";
import { SafeAreaView, StatusBar, useColorScheme } from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";
import CrowdConnectedProvider from "./CrowdConnected";
import CrowdConnectedLocationDemo from "./components/CrowdConnectedLocationDemo";

const CC_KEY = "YOUR_APP_KEY";
const CC_TOKEN = "YOUR_APP_TOKEN";
const CC_SECRET = "YOUR_APP_SECRET";

const App = () => {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <CrowdConnectedProvider
        appKey={CC_KEY}
        appToken={CC_TOKEN}
        appSecret={CC_SECRET}
      >
        <CrowdConnectedLocationDemo />
      </CrowdConnectedProvider>
    </SafeAreaView>
  );
};

export default App;
