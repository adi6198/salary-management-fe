import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import Button from './Button';
import '../../styles/components.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  limit, 
  onLimitChange 
}) => {
  if (totalPages <= 1 && (!totalItems || totalItems <= limit)) return null;

  const generatePageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        {totalItems > 0 ? (
          <span>
            Showing <strong>{(currentPage - 1) * limit + 1}</strong> to <strong>{Math.min(currentPage * limit, totalItems)}</strong> of <strong>{totalItems}</strong> entries
          </span>
        ) : null}
      </div>

      <div className="pagination-controls">
        {onLimitChange && (
          <div className="pagination-limit">
            <select 
              value={limit} 
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="limit-select"
            >
              <option value="10">10 / page</option>
              <option value="25">25 / page</option>
              <option value="50">50 / page</option>
              <option value="100">100 / page</option>
            </select>
          </div>
        )}

        <div className="pagination-buttons">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <ChevronLeft size={16} />
          </Button>

          {pages.map((p, index) => (
            p === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                <MoreHorizontal size={16} />
              </span>
            ) : (
              <Button
                key={`page-${p}`}
                variant={p === currentPage ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(p)}
                className={`pagination-btn ${p === currentPage ? 'active' : ''}`}
              >
                {p}
              </Button>
            )
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
