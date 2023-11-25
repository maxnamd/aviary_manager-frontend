import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import useDebounce from '../birds-debouncing';
import FilterComponent from '../filter-component';

const columns = [
  { name: 'ID', selector: (row) => row.id, defaultSortAsc: true },
  {
    name: 'Band Number',
    selector: (row) => row.band_number,
    defaultSortAsc: true,
    sortable: true,
    sortField: 'band_number',
  },
  { name: 'Sex', selector: (row) => row.sex, defaultSortAsc: true },
  { name: 'Cage Number', selector: (row) => row.cage_number, defaultSortAsc: true },
  { name: 'Date of Banding', selector: (row) => row.date_of_banding, defaultSortAsc: true },
  { name: 'Date of Birth', selector: (row) => row.date_of_birth, defaultSortAsc: true },
  { name: 'Mutation ID', selector: (row) => row.mutation_id, defaultSortAsc: true },
  { name: 'Species ID', selector: (row) => row.species_id, defaultSortAsc: true },
  { name: 'Variety ID', selector: (row) => row.variety_id, defaultSortAsc: true },
  {
    name: 'Father Band Number',
    selector: (row) => row.origin_father_band_number,
    defaultSortAsc: true,
  },
  {
    name: 'Mother Band Number',
    selector: (row) => row.origin_mother_band_number,
    defaultSortAsc: true,
  },
  { name: 'Notes', selector: (row) => row.notes, defaultSortAsc: true },
  { name: 'Gallery', selector: (row) => row.gallery, defaultSortAsc: true },
  { name: 'Status', selector: (row) => row.status, defaultSortAsc: true },
];

const BirdsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);

  const debouncedFilterText = useDebounce(filterText, 500);

  const fetchBirds = useCallback(
    async (page, newPerPage = perPage, sortField = 'id', direction = 'asc', search = '') => {
      setLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/birds?page=${page}&per_page=${newPerPage}&sort=${sortField}&direction=${direction}&search=${search}`,
          {
            headers: {
              Authorization: 'Bearer 2|jfe8niTYuo1Dr2h6FwQmJ4obS4LUAmBE1VtMX4af3ef92267',
            },
          }
        );

        setData(response.data.data);
        setTotalRows(response.data.pagination ? response.data.pagination.total : 0);
      } catch (error) {
        console.error('Error fetching birds:', error);
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    fetchBirds(1, perPage, 'id', 'asc', debouncedFilterText);
  }, [debouncedFilterText, perPage, fetchBirds]);

  const handlePageChange = (page) => {
    fetchBirds(page, perPage, 'id', 'asc', debouncedFilterText);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    fetchBirds(page, newPerPage, 'id', 'asc', debouncedFilterText);
    setPerPage(newPerPage);
  };

  const handleSort = (column, sortDirection) => {
    const direction = sortDirection || 'asc';
    fetchBirds(1, perPage, column.sortField, direction, debouncedFilterText);
  };

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <div style={{ minHeight: '500px' }}>
      <DataTable
        title="Birds"
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        paginationRowsPerPageOptions={[10, 50, 100]}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onSort={handleSort}
        sortServer
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
      />
    </div>
  );
};

export default BirdsTable;
