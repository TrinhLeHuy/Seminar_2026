import API from './api';

export const scanQR = async (qrValue) => {
  const response = await API.post('/qr-scan', {
    qrValue,
    deviceInfo: 'Android Device',
  });
  return response.data;
};