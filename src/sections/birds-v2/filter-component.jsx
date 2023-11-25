import React from 'react';
import PropTypes from 'prop-types';

const FilterComponent = ({ onFilter, onClear, filterText }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <input
      id="search"
      type="text"
      placeholder="Search"
      value={filterText}
      onChange={onFilter}
      style={{ marginLeft: '5px', marginRight: '5px' }}
    />
    <button type="button" onClick={onClear} style={{ marginLeft: '5px' }}>
      Clear
    </button>
  </div>
);

FilterComponent.propTypes = {
  onFilter: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  filterText: PropTypes.string.isRequired,
};

export default FilterComponent;
