import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Link,
  Stack,
} from '@mui/material';
import Box from '@mui/material/Box';
import Label from 'src/components/label';
import Mock1 from 'src/components/mock-images/mock1.jpg';

const BirdCard = ({ bird, onEdit }) => {
  const renderStatus = (
    <Label
      variant="filled"
      color={(bird.status === 'Available' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {bird.status}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={bird.name}
      src={bird.gallery && bird.gallery.length > 0 ? bird.gallery[0] : Mock1}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const handleEditClick = () => {
    // Call the parent callback to open the edit modal and pass the bird data
    onEdit(bird);
  };

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {bird.status && renderStatus}
        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          Band Number: {bird.band_number}
        </Link>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          Cage Number: {bird.cage_number}
        </Link>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 3 }}>
        <Button onClick={handleEditClick}>Edit Bird</Button>
      </Stack>
    </Card>
  );
};

BirdCard.propTypes = {
  bird: PropTypes.object,
  onEdit: PropTypes.func.isRequired, // Callback function to handle editing
};

export default BirdCard;
