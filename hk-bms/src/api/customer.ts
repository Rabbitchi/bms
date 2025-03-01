import  httpClient  from './common';

export const getCustomerList = async () => {
  return httpClient.get('/customer/show');
};

export const getCustomerNameList = async () => {
  return httpClient.get('/customer/getNameList');
};
