import * as authApi from '../api/auth.api';
import { mockEmployees } from './employees.mock';
import { mockDepartments } from './departments.mock';
import { mockJobTitles } from './jobTitles.mock';

// Helper to simulate network latency
const simulateDelay = (data, delayMs = 400) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delayMs);
  });
};

const mockUser = {
  id: 'd9b04f32-cf50-4822-8356-d762e87c0a87',
  email: 'admin@company.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'HR_MANAGER',
  isActive: true,
};

const mockToken = 'dummy-jwt-token-salaryhub';

// Mutable store for mock employees during session
let employeesStore = [...mockEmployees];

export const login = async (email, password) => {
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';
  
  if (useMocks) {
    if (email === 'admin@company.com' && password === 'admin123') {
      return simulateDelay({
        token: mockToken,
        user: mockUser,
      });
    } else {
      return simulateDelay(
        Promise.reject({
          response: {
            status: 400,
            data: {
              success: false,
              message: 'Invalid email or password',
            },
          },
        })
      );
    }
  }
  
  return authApi.login(email, password);
};

export const getMe = async () => {
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

  if (useMocks) {
    return simulateDelay({
      user: mockUser,
    });
  }

  return authApi.getMe();
};

export const getEmployees = async (params = {}) => {
  return simulateDelay((() => {
    let result = [...employeesStore];

    // Filter by search term
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        e =>
          e.firstName.toLowerCase().includes(q) ||
          e.lastName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.employeeCode.toLowerCase().includes(q)
      );
    }

    // Filter by status
    if (params.status !== undefined && params.status !== '') {
      const isActive = params.status === 'ACTIVE' || params.status === 'true' || params.status === true;
      result = result.filter(e => e.isActive === isActive);
    }

    // Filter by department
    if (params.departmentId) {
      result = result.filter(e => e.departmentId === params.departmentId);
    }

    // Filter by job title
    if (params.jobTitleId) {
      result = result.filter(e => e.jobTitleId === params.jobTitleId);
    }

    // Sorting
    const sort = params.sort || 'createdAt';
    const order = params.order || 'desc';

    result.sort((a, b) => {
      let valA = a[sort];
      let valB = b[sort];
      
      if (sort === 'createdAt' || sort === 'hireDate') {
        valA = new Date(valA || a.hireDate).getTime();
        valB = new Date(valB || b.hireDate).getTime();
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const page = parseInt(params.page, 10) || 1;
    const limit = parseInt(params.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedItems = result.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        items: paginatedItems,
        meta: {
          total: result.length,
          page,
          limit,
          totalPages: Math.ceil(result.length / limit),
        }
      }
    };
  })(), 500); // 500ms delay to feel realistic
};

export const getDepartments = async () => {
  return simulateDelay({
    success: true,
    data: mockDepartments
  });
};

export const getJobTitles = async () => {
  return simulateDelay({
    success: true,
    data: mockJobTitles
  });
};
