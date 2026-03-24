// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { login } from '../api/auth';

// const handleLogin = async () => {
//   try {
//     const data = await login(username, password);

//     await AsyncStorage.setItem('token', data.token);
//     await AsyncStorage.setItem('userId', data.userId.toString());
//     await AsyncStorage.setItem('role', data.role);

//     alert('Login success');
//   } catch (err) {
//     alert('Login failed');
//   }
// };