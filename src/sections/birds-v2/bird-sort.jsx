// bird-sort.jsx
import PropTypes from 'prop-types';
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify';

export const SORT_OPTIONS = [
  { value: 'band_number', label: 'Band Number', direction: 'asc' },
  { value: 'cage_number', label: 'Cage Number', direction: 'asc' },
  { value: 'date_of_banding', label: 'Date of Banding', direction: 'asc' },
  { value: 'date_of_birth', label: 'Date of Birth', direction: 'asc' },
  { value: 'status', label: 'Status', direction: 'asc' },
];

const BirdSort = ({ onSortChange }) => {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSortChange = (option) => {
    onSortChange(option);
    handleClose();
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          Status
        </Typography>
      </Button>

      <Menu
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              [`& .${listClasses.root}`]: {
                p: 0,
              },
            },
          },
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={false} // Ensure that the selected state is not always 'newest'
            onClick={() => handleSortChange(option)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

BirdSort.propTypes = {
  onSortChange: PropTypes.func.isRequired,
};

export default BirdSort;
