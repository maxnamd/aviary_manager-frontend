// Bird Card
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';

// import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
// import { ColorPreview } from 'src/components/color-utils';
import Mock1 from 'src/components/mock-images/mock1.jpg';

// ----------------------------------------------------------------------

export default function BirdCard({ bird }) {
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
      src={Mock1}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  // const renderPrice = (
  //   <Typography variant="subtitle1">
  //     <Typography
  //       component="span"
  //       variant="body1"
  //       sx={{
  //         color: 'text.disabled',
  //         textDecoration: 'line-through',
  //       }}
  //     >
  //       {bird.status}
  //     </Typography>
  //     &nbsp;
  //     {fCurrency(bird.price)}
  //   </Typography>
  // );

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
        {/* <Stack direction="row" alignItems="center" justifyContent="space-between">
          <ColorPreview colors={bird.st} />
          {renderPrice}
        </Stack> */}
      </Stack>
    </Card>
  );
}

BirdCard.propTypes = {
  bird: PropTypes.object,
};
