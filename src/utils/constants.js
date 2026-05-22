export const ROUTES = {
  LOGIN: '/login',
  EMPLOYEES: '/employees',
  EMPLOYEE_NEW: '/employees/new',
  EMPLOYEE_DETAIL: '/employees/:id',
  EMPLOYEE_EDIT: '/employees/:id/edit',
  DASHBOARD: '/dashboard',
};

export const GENDERS = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
  PREFER_NOT_TO_SAY: 'PREFER_NOT_TO_SAY',
};

export const GENDER_LABELS = {
  [GENDERS.MALE]: 'Male',
  [GENDERS.FEMALE]: 'Female',
  [GENDERS.OTHER]: 'Other',
  [GENDERS.PREFER_NOT_TO_SAY]: 'Prefer not to say',
};

export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  INTERN: 'INTERN',
};

export const EMPLOYMENT_TYPE_LABELS = {
  [EMPLOYMENT_TYPES.FULL_TIME]: 'Full-time',
  [EMPLOYMENT_TYPES.PART_TIME]: 'Part-time',
  [EMPLOYMENT_TYPES.CONTRACT]: 'Contract',
  [EMPLOYMENT_TYPES.INTERN]: 'Intern',
};

export const DEACTIVATION_REASONS = {
  RESIGNED: 'RESIGNED',
  TERMINATED: 'TERMINATED',
  END_OF_CONTRACT: 'END_OF_CONTRACT',
  LAYOFF: 'LAYOFF',
  OTHER: 'OTHER',
};

export const DEACTIVATION_REASON_LABELS = {
  [DEACTIVATION_REASONS.RESIGNED]: 'Resigned',
  [DEACTIVATION_REASONS.TERMINATED]: 'Terminated',
  [DEACTIVATION_REASONS.END_OF_CONTRACT]: 'End of Contract',
  [DEACTIVATION_REASONS.LAYOFF]: 'Layoff',
  [DEACTIVATION_REASONS.OTHER]: 'Other',
};

export const STATUS_OPTIONS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ALL: 'all',
};

export const STATUS_LABELS = {
  [STATUS_OPTIONS.ACTIVE]: 'Active',
  [STATUS_OPTIONS.INACTIVE]: 'Inactive',
  [STATUS_OPTIONS.ALL]: 'All Statuses',
};

export const PAGE_SIZES = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;
