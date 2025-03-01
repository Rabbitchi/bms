import httpClient from './common';

export const getSalesOverview = (year: number) => httpClient.get('/boards/show', { params: { year } });
