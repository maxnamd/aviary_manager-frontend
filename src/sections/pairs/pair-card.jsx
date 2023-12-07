import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardMedia, Grid, Typography, Stack } from '@mui/material';
import { Icon } from '@iconify/react';
import MaleIcon from '@iconify/icons-material-symbols/male-rounded';
import FemaleIcon from '@iconify/icons-material-symbols/female-rounded';

const PairCard = ({ pair }) => (
  <Card>
    <Grid container spacing={2}>
      {/* First Image and Label */}
      <Grid item xs={6}>
        <CardMedia component="img" alt="Image 1" height="140" image={pair.male_pic} />
        <CardContent>
          <Typography variant="h6" component="div">
            <Icon icon={MaleIcon} style={{ color: 'blue', fontSize: '30px' }} />
            {pair.pair_male}
          </Typography>
        </CardContent>
      </Grid>

      {/* Second Image and Label */}
      <Grid item xs={6}>
        <CardMedia component="img" alt="Image 2" height="140" image={pair.female_pic} />
        <CardContent>
          <Typography variant="h6" component="div">
            <Icon icon={FemaleIcon} style={{ color: '#ef1ba6', fontSize: '30px' }} />
            {pair.pair_female}
          </Typography>
        </CardContent>
      </Grid>
    </Grid>

    {/* Stack for displaying cage_number and species_name */}
    <Stack direction="row" spacing={2} sx={{ padding: 2 }} justifyContent="space-between">
      <Typography variant="body1">{pair.cage_number}</Typography>
      <Typography variant="body1">{pair.species_name}</Typography>
    </Stack>
  </Card>
);

PairCard.propTypes = {
  pair: PropTypes.shape({
    id: PropTypes.number,
    pair_male: PropTypes.string,
    pair_female: PropTypes.string,
    beginning: PropTypes.string,
    cage_number: PropTypes.string,
    status: PropTypes.number,
    male_pic: PropTypes.string,
    female_pic: PropTypes.string,
    species_name: PropTypes.string, // Make sure to add this property to PropTypes
  }),
};

export default PairCard;
