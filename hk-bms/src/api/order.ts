import httpClient from './common';

export const getOrderList = (params: any) => httpClient.get('/order/pageFind', { params });
export const addOrder = (data: any) => httpClient.post('/order/add', data);
export const updateOrder = (data: any) => httpClient.post('/order/update', data);
export const deleteOrder = (orderId: string) => httpClient.post(`/order/delete?orderId=${orderId}`);
export const exportOrder = (params: any) => httpClient.get('/order/export', { params, responseType: 'blob' });
export const importOrder = (formData: FormData) => httpClient.post('/order/import', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
