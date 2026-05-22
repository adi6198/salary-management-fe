import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
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
}) => {
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
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={`${col.sortable ? 'sortable' : ''} ${col.align === 'right' ? 'text-right' : ''}`}
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
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((col) => (
                <td 
                  key={`${row.id || rowIndex}-${col.key}`}
                  className={`${col.align === 'right' ? 'text-right' : ''}`}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
