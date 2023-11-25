// birds-v2-view.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import BirdCard from '../bird-card';
import BirdFilters from '../bird-filter';
import BirdSort from '../bird-sort';

const BirdsV2View = () => {
  const [birds, setBirds] = useState([]);
  const [isGrid, setIsGrid] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    gender: [],
    status: '',
  });  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genderParam = filters.gender.length > 0 ? `&gender=${filters.gender.join(',')}` : '';
        const statusParam = filters.status ? `&status=${filters.status}` : '';
        
        const response = await axios.get(
          `http://localhost:8000/api/v1/birds?page=${currentPage}&per_page=20${genderParam}${statusParam}`,
          {
            headers: {
              Authorization: 'Bearer 2|jfe8niTYuo1Dr2h6FwQmJ4obS4LUAmBE1VtMX4af3ef92267',
            },
          }
        );
        setBirds(response.data.data);
        setTotalPages(response.data.pagination.last_page);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage, filters]);

  const toggleLayout = () => {
    setIsGrid((prevIsGrid) => !prevIsGrid);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (selectedFilters) => {
    // Handle the selected filters, you can set it to the state or perform other actions
    setFilters(selectedFilters);
  };

  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <Container>
      <Button
        onClick={toggleLayout}
        variant="outlined"
        color="primary"
        style={{ marginBottom: '10px' }}
      >
        {isGrid ? 'Switch to List' : 'Switch to Grid'}
      </Button>

      <Typography variant="h4" sx={{ mb: 5 }}>
        Birdies
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          defaultPage={1}
          color="primary"
        />
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <BirdFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            onFilterChange={handleFilterChange} // Pass the callback function to handle filter changes
          />

          <BirdSort />
        </Stack>
      </Stack>

      {isGrid ? (
        <Grid container spacing={3}>
          {birds.map((bird) => (
            <Grid item key={bird.id} xs={12} sm={6} md={4} lg={3}>
              <BirdCard bird={bird} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div>
          {birds.map((bird) => (
            <BirdCard key={bird.id} bird={bird} />
          ))}
        </div>
      )}

      <Stack
        spacing={2}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          defaultPage={1}
          color="primary"
        />
      </Stack>
    </Container>
  );
};

export default BirdsV2View;
