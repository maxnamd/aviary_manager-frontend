import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import FormControlLabel from '@mui/material/FormControlLabel';

export const GENDER_OPTIONS = ['M', 'F'];
export const STATUS_OPTIONS = ['Available', 'Deceased', 'Sold', 'Donated'];

const BirdFilters = ({ openFilter, onOpenFilter, onCloseFilter, onFilterChange, selectedFilters }) => {
  const [internalFilters, setInternalFilters] = useState({
    gender: [],
    status: '',
  });

  useEffect(() => {
    // Initialize internal state with the selected filters or default values
    setInternalFilters(selectedFilters || { gender: [], status: '' });
  }, [selectedFilters]);

  const handleApplyFilters = () => {
    onFilterChange(internalFilters);
    onCloseFilter();
  };

  const handleGenderChange = (item) => {
    setInternalFilters((prevFilters) => ({
      ...prevFilters,
      gender: prevFilters.gender.includes(item)
        ? prevFilters.gender.filter((selected) => selected !== item)
        : [...prevFilters.gender, item],
    }));
  };

  const handleStatusChange = (item) => {
    setInternalFilters((prevFilters) => ({
      ...prevFilters,
      status: prevFilters.status === item ? '' : item,
    }));
  };

  const handleResetFilters = () => {
    // Reset filters to default values
    setInternalFilters({ gender: [], status: '' });
  
    // Apply filters immediately
    onFilterChange({ gender: [], status: '' });
  
    // Close the filter drawer
    onCloseFilter();
  };
  

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={onOpenFilter}
      >
        Filters&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="h6" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Gender</Typography>
              <FormGroup>
                {GENDER_OPTIONS.map((item) => (
                  <FormControlLabel
                    key={item}
                    control={
                      <Checkbox
                        id={`gender-${item}`}
                        checked={internalFilters.gender.includes(item)}
                        onChange={() => handleGenderChange(item)}
                      />
                    }
                    label={item}
                  />
                ))}
              </FormGroup>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Status</Typography>
              <RadioGroup>
                {STATUS_OPTIONS.map((item) => (
                  <FormControlLabel
                    key={item}
                    value={item}
                    control={
                      <Radio
                        id={`status-${item}`}
                        checked={internalFilters.status === item}
                        onChange={() => handleStatusChange(item)}
                      />
                    }
                    label={item}
                  />
                ))}
              </RadioGroup>
            </Stack>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={handleApplyFilters}
            startIcon={<Iconify icon="ic:round-check" />}
          >
            Apply Filters
          </Button>

          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            onClick={handleResetFilters}
            startIcon={<Iconify icon="ic:round-refresh" />}
            sx={{ mt: 2 }}
          >
            Reset Filters
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

BirdFilters.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  onFilterChange: PropTypes.func,
  selectedFilters: PropTypes.shape({
    gender: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
  }),
};

export default BirdFilters;
