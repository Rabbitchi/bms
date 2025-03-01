import httpClient from "./common";

// 获取客户列表
export const getLogin = (employeeId: string, password: string) => {

  return httpClient.post("/login/common", { employeeId, password },{
    headers: {
        'Content-Type': 'application/json',
      },
  });
};
