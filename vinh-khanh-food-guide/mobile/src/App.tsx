import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* AUTH */
import LoginScreen from "./screens/LoginScreen";
import RegisterUserScreen from "./screens/RegisterUserScreen";
import RegisterBusinessScreen from "./screens/RegisterBusinessScreen";

/* MAIN APP */
import BottomTabs from "./components/BottomTab";
import QRScannerScreen from "./screens/QRScanScreen";
import LocationDetail from "./screens/LocationDetail";

/* ADMIN */
import AdminDashboard from "./screens/admin/AdminDashboard";
import ApproveBusiness from "./screens/admin/ApproveBusiness";
import CreateQR from "./screens/admin/CreateQR";
import QRLogs from "./screens/admin/QRLogs";
import BusinessDetailScreen from "./screens/admin/BusinessDetailScreen";
import LocationManagementScreen from "./screens/admin/LocationManagementScreen";

/* LOCATION */
import LocationCreateScreen from "./screens/LocationCreateScreen";
import LocationDetailScreen from "./screens/LocationDetailScreen";

/* FOOD */
import FoodManagementScreen from "./screens/FoodManagementScreen";

/* QR */
import QRManagementScreen from "./screens/QRManagementScreen";

/* LANGUAGE */
import { LanguageProvider } from "./i18n/LanguageContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* ================= AUTH ================= */}

          <Stack.Screen name="Login" component={LoginScreen} />

          <Stack.Screen name="RegisterUser" component={RegisterUserScreen} />

          <Stack.Screen
            name="RegisterBusiness"
            component={RegisterBusinessScreen}
          />

          {/* ================= MAIN APP ================= */}

          <Stack.Screen name="MainTabs" component={BottomTabs} />

          <Stack.Screen name="QRScanner" component={QRScannerScreen} />

          <Stack.Screen name="LocationDetail" component={LocationDetail} />

          {/* ================= ADMIN ================= */}

          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />

          <Stack.Screen name="ApproveBusiness" component={ApproveBusiness} />

          <Stack.Screen name="CreateQR" component={CreateQR} />

          <Stack.Screen name="QRLogs" component={QRLogs} />

          <Stack.Screen
            name="BusinessDetail"
            component={BusinessDetailScreen}
          />

          {/* ================= LOCATION MANAGEMENT ================= */}

          <Stack.Screen
            name="LocationManagementScreen"
            component={LocationManagementScreen}
          />

          <Stack.Screen
            name="LocationCreate"
            component={LocationCreateScreen}
          />

          <Stack.Screen
            name="LocationDetailScreen"
            component={LocationDetailScreen}
          />

          {/* ================= FOOD ================= */}

          <Stack.Screen
            name="FoodManagement"
            component={FoodManagementScreen}
          />

          {/* ================= QR ================= */}

          <Stack.Screen name="QRManagement" component={QRManagementScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}
