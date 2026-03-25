import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterBusinessScreen from './screens/RegisterBusinessScreen';

import BottomTabs from './components/BottomTab';

import QRScannerScreen from './screens/QRScanScreen';
import LocationDetail from './screens/LocationDetail';

import { LanguageProvider } from './i18n/LanguageContext';

import AdminDashboard from './screens/admin/AdminDashboard';
import ApproveBusiness from './screens/admin/ApproveBusiness';
import CreateQR from './screens/admin/CreateQR';
import QRLogs from './screens/admin/QRLogs';

import RegisterUserScreen from './screens/RegisterUserScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {/* 🔐 LOGIN */}
          <Stack.Screen name="Login" component={LoginScreen} />

          <Stack.Screen
              name="RegisterUser"
              component={RegisterUserScreen}
            />

          {/* 🏪 REGISTER */}
          <Stack.Screen
            name="RegisterBusiness"
            component={RegisterBusinessScreen}
          />
          {/* ADMIN */}
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="ApproveBusiness" component={ApproveBusiness} />
          <Stack.Screen name="CreateQR" component={CreateQR} />
          <Stack.Screen name="QRLogs" component={QRLogs} />

          {/* 🌍 APP CHÍNH (TAB) */}
          <Stack.Screen name="MainTabs" component={BottomTabs} />

          {/* 📷 QR */}
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />

          {/* 📍 DETAIL */}
          <Stack.Screen name="LocationDetail" component={LocationDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}