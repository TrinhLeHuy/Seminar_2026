import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import LanguageScreen from '../screens/LanguageScreen';
import QRScanScreen from '../screens/QRScanScreen';
import { Ionicons } from '@expo/vector-icons';
import { View } from "react-native";
import { useLanguage } from '../i18n/LanguageContext';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {

  const { t, lang } = useLanguage();

  return (

    <Tab.Navigator
      key={lang}
      screenOptions={{ headerShown:false }}
    >

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title:t.home,
          tabBarIcon:({color})=>(
            <Ionicons name="home" size={22} color={color}/>
          )
        }}
      />

      <Tab.Screen
        name="QR"
        component={QRScanScreen}
        options={{
          title:"",
          tabBarIcon:()=>(
            <View style={{
              width:60,
              height:60,
              borderRadius:30,
              backgroundColor:"#FF3B30",
              justifyContent:"center",
              alignItems:"center",
              marginBottom:25
            }}>
              <Ionicons name="camera" size={28} color="white"/>
            </View>
          )
        }}
      />

      <Tab.Screen
        name="Lang"
        component={LanguageScreen}
        options={{
          title:t.lang,
          tabBarIcon:({color})=>(
            <Ionicons name="globe" size={22} color={color}/>
          )
        }}
      />

    </Tab.Navigator>

  );

}