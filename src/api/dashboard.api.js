import apiClient from './client';

export const getSalarySummaryByCountry = async () => {
  return apiClient.get('/dashboard/salary/summary');
};

export const getAverageByDepartment = async () => {
  return apiClient.get('/dashboard/salary/average-by-department');
};

export const getAverageByJobTitle = async () => {
  return apiClient.get('/dashboard/salary/average-by-job-title');
};

export const getAverageByDeptCountry = async () => {
  return apiClient.get('/dashboard/salary/average-by-department-country');
};

export const getAverageByJobCountry = async () => {
  return apiClient.get('/dashboard/salary/average-by-job-title-country');
};
