import * as authApi from '../api/auth.api';
import { mockEmployees } from './employees.mock';
import { mockDepartments } from './departments.mock';
import { mockJobTitles } from './jobTitles.mock';
import { mockAuditLogs } from './auditLogs.mock';

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
  fullName: 'Admin User',
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
          e.fullName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.employeeCode.toLowerCase().includes(q)
      );
    }

    // Filter by status (is_active)
    if (params.is_active !== undefined && params.is_active !== '') {
      const isActive = params.is_active === 'ACTIVE' || params.is_active === 'true' || params.is_active === true;
      result = result.filter(e => e.isActive === isActive);
    }

    // Filter by country
    if (params.country) {
      result = result.filter(e => e.country === params.country);
    }

    // Filter by gender
    if (params.gender) {
      result = result.filter(e => e.gender === params.gender);
    }

    // Filter by employment type
    if (params.employment_type) {
      result = result.filter(e => e.employmentType === params.employment_type);
    }

    // Filter by department
    if (params.department_id) {
      result = result.filter(e => e.departmentId === params.department_id);
    }

    // Filter by job title
    if (params.job_title_id) {
      result = result.filter(e => e.jobTitleId === params.job_title_id);
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

export const getAuditLogs = async (employeeId, params = {}) => {
  return simulateDelay((() => {
    // Filter by employeeId
    const result = mockAuditLogs.filter(log => log.employeeId === employeeId);

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
  })(), 500);
};
