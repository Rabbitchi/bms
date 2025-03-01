import  httpClient  from './common';

// 获取客户列表
export const getEmployeeList = async (page: number, size: number) => {
  return httpClient.get('/employee/show',  { params: { page, size }});
};
export const addEmployee = async (data:any) => {
    return httpClient.post('/employee/add',data);
  };
  export const getSalesmanList = async () => {
    return httpClient.get('/employee/getNameList');
  };



