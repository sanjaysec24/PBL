import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchableKey?: keyof T;
  searchPlaceholder?: string;
}

export function DataTable<T>({
  columns,
  data,
  pageSize = 10,
  searchableKey,
  searchPlaceholder = 'Search records...',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter logic
  const filteredData = searchableKey
    ? data.filter((item) => {
        const val = item[searchableKey];
        return String(val ?? '').toLowerCase().includes(searchTerm.toLowerCase());
      })
    : data;

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pageData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] shadow-soft overflow-hidden">
      {/* Table Top Controls */}
      {searchableKey && (
        <div className="p-4 border-b border-[#B6CCD9]/60 flex items-center justify-between gap-3 bg-[#FFFFFF]">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-[#7FA3B8] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchTerm}
              aria-label={searchPlaceholder}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F3FBFF] border border-[#B6CCD9] rounded-xl text-[#0E6B6B] placeholder-[#7FA3B8] focus:outline-hidden focus:ring-2 focus:ring-[#0BAA9F]/20 focus:border-[#0BAA9F] transition-all font-sans"
            />
          </div>
          <span className="text-xs text-[#7FA3B8] font-normal font-mono">
            Total: <strong className="text-[#0E6B6B] font-semibold">{filteredData.length}</strong> records
          </span>
        </div>
      )}

      {/* Table Main View */}
      <div 
        tabIndex={0}
        role="region"
        aria-label="Data Table Scrollable Container"
        className="overflow-x-auto focus:outline-hidden focus:ring-1 focus:ring-[#0BAA9F]/30"
      >
        <table className="w-full text-left text-xs text-[#0E6B6B]">
          <thead className="bg-[#F3FBFF] border-b border-[#B6CCD9] text-[11px] uppercase tracking-wider font-semibold text-[#7FA3B8]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3.5 ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#B6CCD9]/40 font-mono">
            {pageData.length > 0 ? (
              pageData.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#E6F6FF]/40 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 whitespace-nowrap ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      }`}
                    >
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-[#7FA3B8] font-sans">
                  No records match the current filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3.5 border-t border-[#B6CCD9] bg-[#F3FBFF]/70 flex items-center justify-between text-xs text-[#7FA3B8] font-sans">
          <span>
            Page <strong className="text-[#0E6B6B] font-semibold">{currentPage}</strong> of{' '}
            <strong className="text-[#0E6B6B] font-semibold">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="p-1.5 rounded-lg border border-[#B6CCD9] bg-white text-[#0E6B6B] hover:bg-[#E6F6FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0BAA9F]/20 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.75]" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="p-1.5 rounded-lg border border-[#B6CCD9] bg-white text-[#0E6B6B] hover:bg-[#E6F6FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0BAA9F]/20 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 stroke-[1.75]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

