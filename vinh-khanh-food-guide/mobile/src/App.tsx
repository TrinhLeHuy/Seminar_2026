import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabs from './components/BottomTab';
import QRScannerScreen from './screens/QRScanScreen';
import LocationDetail from './screens/LocationDetail';

import { LanguageProvider } from './i18n/LanguageContext';

const Stack = createNativeStackNavigator();

export default function App() {

  return (

    <LanguageProvider>

      <NavigationContainer>

        <Stack.Navigator screenOptions={{ headerShown: false }}>

          <Stack.Screen
            name="MainTabs"
            component={BottomTabs}
          />

          <Stack.Screen
            name="QRScanner"
            component={QRScannerScreen}
          />

          <Stack.Screen
            name="LocationDetail"
            component={LocationDetail}
          />

        </Stack.Navigator>

      </NavigationContainer>

    </LanguageProvider>

  );

}