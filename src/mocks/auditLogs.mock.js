export const mockAuditLogs = [
  {
    id: 'a1',
    employeeId: 'e1',
    action: 'CREATED',
    changedBy: { id: 'u1', fullName: 'Admin User', email: 'admin@company.com' },
    changeReason: 'Initial employee creation',
    createdAt: '2020-01-10T10:00:00Z',
    changes: [
      { fieldName: 'full_name', oldValue: null, newValue: 'John Doe' },
      { fieldName: 'salary_local', oldValue: null, newValue: '150000' }
    ]
  },
  {
    id: 'a2',
    employeeId: 'e1',
    action: 'UPDATED',
    changedBy: { id: 'u1', fullName: 'Admin User', email: 'admin@company.com' },
    changeReason: 'Annual salary review',
    createdAt: '2021-01-15T14:30:00Z',
    changes: [
      { fieldName: 'salary_local', oldValue: '140000', newValue: '150000' },
      { fieldName: 'job_title_id', oldValue: '1', newValue: '2' }
    ]
  },
  {
    id: 'a3',
    employeeId: 'e3',
    action: 'DELETED',
    changedBy: { id: 'u2', fullName: 'HR Manager', email: 'hr@company.com' },
    changeReason: 'Employee resigned to pursue other opportunities',
    createdAt: '2024-01-15T09:15:00Z',
    changes: [
      { fieldName: 'is_active', oldValue: 'true', newValue: 'false' },
      { fieldName: 'deactivation_reason', oldValue: null, newValue: 'RESIGNED' }
    ]
  }
];
