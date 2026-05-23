import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronDown, ChevronRight } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import '../../styles/data-table.css';

const DataTable = ({
  columns,
  data,
  isLoading,
  sortColumn,
  sortDirection,
  onSort,
  emptyStateTitle = 'No records found',
  emptyStateDesc = 'Adjust your filters or try a different search term.',
  expandableRowContent, // (row) => ReactNode
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (id) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRows(newSet);
  };

  const renderSortIcon = (columnKey) => {
    if (sortColumn !== columnKey) return <ArrowUpDown size={14} className="sort-icon inactive" />;
    return sortDirection === 'asc' ? <ArrowUp size={14} className="sort-icon active" /> : <ArrowDown size={14} className="sort-icon active" />;
  };

  if (isLoading && (!data || data.length === 0)) {
    return (
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={`th-skel-${i}`}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={`tr-skel-${rowIndex}`}>
                {columns.map((col, colIndex) => (
                  <td key={`td-skel-${rowIndex}-${colIndex}`}>
                    <Skeleton height="20px" width={col.width || '100%'} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-empty-container">
        <EmptyState title={emptyStateTitle} description={emptyStateDesc} />
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {expandableRowContent && <th style={{ width: '40px' }}></th>}
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={`${col.sortable ? 'sortable' : ''} ${col.align === 'right' ? 'text-right' : ''} ${col.pinned === 'right' ? 'col-pinned-right' : ''}`}
                onClick={() => col.sortable && onSort(col.key)}
                style={{ width: col.width }}
              >
                <div className={`th-content ${col.align === 'right' ? 'justify-end' : ''}`}>
                  {col.header}
                  {col.sortable && renderSortIcon(col.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const rowId = row.id || rowIndex;
            const isExpanded = expandedRows.has(rowId);
            return (
              <React.Fragment key={rowId}>
                <tr className={isExpanded ? 'expanded-parent' : ''}>
                  {expandableRowContent && (
                    <td className="expand-cell" onClick={() => toggleRow(rowId)}>
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </td>
                  )}
                  {columns.map((col) => (
                    <td 
                      key={`${rowId}-${col.key}`}
                      className={`${col.align === 'right' ? 'text-right' : ''} ${col.pinned === 'right' ? 'col-pinned-right' : ''}`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
                {isExpanded && expandableRowContent && (
                  <tr className="expanded-row">
                    <td colSpan={columns.length + 1} className="expanded-content">
                      {expandableRowContent(row)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
