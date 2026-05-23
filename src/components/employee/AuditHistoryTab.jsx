import { useState, useCallback } from 'react';
import { FileText, Clock } from 'lucide-react';
import { getAuditLogs } from '../../api/auditLogs.api';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/formatDate';
import DataTable from '../data/DataTable';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import Pagination from '../ui/Pagination';

const AuditHistoryTab = ({ employeeId }) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchLogs = useCallback(
    () => getAuditLogs(employeeId, { page, limit: pageSize }),
    [employeeId, page]
  );

  const { data, meta, loading, error } = useFetch(fetchLogs);

  const formatChangeType = (type) => {
    switch (type) {
      case 'CREATED': return <Badge variant="success">Created</Badge>;
      case 'UPDATED': return <Badge variant="primary">Updated</Badge>;
      case 'DELETED': return <Badge variant="danger">Deleted</Badge>;
      default: return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const columns = [
    {
      key: 'createdAt',
      header: 'Date & Time',
      render: (val) => (
        <div className="flex-row">
          <Clock size={14} className="text-muted" style={{ marginRight: '6px' }} />
          <span>{formatDate(val)}</span>
        </div>
      )
    },
    {
      key: 'action',
      header: 'Change Type',
      render: (val) => formatChangeType(val)
    },
    {
      key: 'changedBy',
      header: 'Changed By',
      render: (val) => {
        if (typeof val === 'object' && val !== null) {
          return `${val.fullName}`;
        }
        return val || '-';
      }
    },
    {
      key: 'changeReason',
      header: 'Reason',
      render: (val) => <span className="text-muted">{val || '-'}</span>
    }
  ];

  const formatFieldName = (fieldName) => {
    const overrides = {
      salary_local: 'Local Salary',
      salary_usd: 'USD Salary',
      job_title_id: 'Job Title',
      department_id: 'Department',
      is_active: 'Active Status'
    };
    if (overrides[fieldName]) return overrides[fieldName];

    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const renderExpandableRow = (row) => {
    if (row.action === 'CREATED') {
      return (
        <div className="audit-diff-container">
          <p className="text-muted" style={{ padding: '12px' }}>
            Initial record creation. All fields initialized.
          </p>
        </div>
      );
    }

    if (!row.changes || row.changes.length === 0) {
      return (
        <div className="audit-diff-container">
          <p className="text-muted" style={{ padding: '12px' }}>
            No explicit field changes recorded.
          </p>
        </div>
      );
    }

    return (
      <div className="audit-diff-container">
        <table className="audit-diff-table">
          <thead>
            <tr>
              <th>Field Name</th>
              <th>Old Value</th>
              <th>New Value</th>
            </tr>
          </thead>
          <tbody>
            {row.changes.map((change, idx) => (
              <tr key={idx}>
                <td className="font-mono text-sm">{formatFieldName(change.field)}</td>
                <td className="diff-old">{change.oldValue === null ? <span className="text-muted italic">null</span> : String(change.oldValue)}</td>
                <td className="diff-new">{change.newValue === null ? <span className="text-muted italic">null</span> : String(change.newValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (error) {
    return (
      <EmptyState 
        icon={FileText} 
        title="Failed to Load Logs" 
        description="There was an error loading the audit history. Please try again later."
      />
    );
  }

  return (
    <div className="audit-history-tab">
      <DataTable
        columns={columns}
        data={data || []}
        isLoading={loading}
        emptyStateTitle="No audit logs found"
        emptyStateDesc="This employee has no recorded audit history."
        expandableRowContent={renderExpandableRow}
      />
      
      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
          totalItems={meta.total}
          itemsPerPage={pageSize}
        />
      )}
    </div>
  );
};

export default AuditHistoryTab;
