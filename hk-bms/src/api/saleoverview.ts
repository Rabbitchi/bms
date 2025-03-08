import httpClient from './common';


// 获取年度概览
export const getYearSalesOverview = async (year: number) =>httpClient.get('/boards/getYearSalesOverview', { params: { year } });

// 获取月度详情
export const getMonthSalesOverview = async (year: number, month: number) => httpClient.get('/boards/getMonthSalesOverview', { params: { year ,month} });
