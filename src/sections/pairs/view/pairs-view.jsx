// pairs-view.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material';

import PairCard from '../pair-card';
import 'react-toastify/dist/ReactToastify.css';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

const myToken = localStorage.getItem('ACCESS_TOKEN');
const PairsView = () => {
  console.log(myToken);
  const [pairs, setPairs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFemaleBirds, setShowFemaleBirds] = useState([]);
  const [showMaleBirds, setShowMaleBirds] = useState([]);
  const [openPairModal, setOpenPairModal] = useState(false);
  const [editingPair, seteditingPair] = useState(null);

  // Function to handle opening and closing of the Add/Edit Bird Modal

  const handleOpenPairModal = (pair = null) => {
    if (pair !== null) {
      // If editing an existing bird, set the newPairData state with the bird's data
      setNewPairData({
        pair_male: pair.pair_male,
        pair_female: pair.pair_female,
        beginning: pair.beginning,
        cage_number: pair.cage_number,
        nest: pair.nest,
        comments: pair.comments,
      });
    } else {
      // If adding a new bird, reset the newPairData state to its default values
      setNewPairData({
        pair_male: '',
        pair_female: '',
        beginning: getFormattedDateTime(),
        date_of_birth: getFormattedDateTime(),
        cage_number: '',
        nest: '',
        comments: '',
      });
    }

    seteditingPair(pair);
    setOpenPairModal(true);
  };

  const handleClosePairModal = () => {
    seteditingPair(null);
    setOpenPairModal(false);
  };

  useEffect(() => {
    const fetchFemaleBirds = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/birds?sex=F&paired=true`,
          {
            headers: {
              Authorization: `Bearer ${myToken}`,
            },
          }
        );
        const femaleBirdsData = response.data.data;
        setShowFemaleBirds(femaleBirdsData);
      } catch (error) {
        console.error('Error fetching female birds:', error);
        // Handle the error appropriately, e.g., show an error message to the user
      }
    };

    fetchFemaleBirds();
  }, []);

  useEffect(() => {
    const fetchMaleBirds = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/birds?sex=M&paired=true`,
          {
            headers: {
              Authorization: `Bearer ${myToken}`,
            },
          }
        );
        const maleBirdsData = response.data.data;
        setShowMaleBirds(maleBirdsData);
      } catch (error) {
        console.error('Error fetching female birds:', error);
        // Handle the error appropriately, e.g., show an error message to the user
      }
    };

    fetchMaleBirds();
  }, []);

  const [newPairData, setNewPairData] = useState({
    pair_male: '',
    pair_female: '',
    beginning: getFormattedDateTime(),
    date_of_birth: getFormattedDateTime(),
    cage_number: '',
    nest: '',
    comments: '',
  });

  const fetchData = useCallback(async () => {
    try {
      //   const genderParam = filters.gender.length > 0 ? `&sex=${filters.gender.join(',')}` : '';
      //   const statusParam = filters.status ? `&status=${filters.status}` : '';

      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/pairs`, {
        headers: {
          Authorization: `Bearer ${myToken}`,
          Accept: '*/*',
        },
      });
      setPairs(response.data.data);
      setTotalPages(response.data.pagination.last_page);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  function getFormattedDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  let pairContent;

  if (pairs.length > 0)
    pairContent = pairs.map((pair) => (
      <Grid container spacing={3}>
        <Grid item key={pair.id} xs={12} sm={12} md={4} lg={3}>
          <PairCard pair={pair} />
        </Grid>
      </Grid>
    ));
  else pairContent = <Typography variant="body1">No records found.</Typography>;

  const handlePairChange = (e) => {
    const { name, value } = e.target;
    setNewPairData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSavePairs = async () => {
    console.log('save pairs clicked');
  };

  return (
    <Container>
      <Button
        variant="outlined"
        color="primary"
        style={{ marginBottom: '10px', margin: '10px' }}
        onClick={() => handleOpenPairModal(null)}
      >
        Add Pair
      </Button>

      <Dialog open={openPairModal} onClose={handleClosePairModal}>
        <DialogTitle>{editingPair ? 'Edit Bird' : 'Add Pair'}</DialogTitle>
        <DialogContent>
          <form>
            <Box sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                label="Pair Male"
                name="pair_male"
                value={newPairData.pair_male || ''}
                onChange={handlePairChange}
                fullWidth
                select
              >
                {showMaleBirds.map((showMale) => (
                  <MenuItem
                    key={showMale.id}
                    value={showMale.band_number || ''}
                    data-species_id={showMale.species_id}
                  >
                    {showMale.band_number} - {showMale.species_name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                margin="normal"
                label="Pair Female"
                name="pair_female"
                value={newPairData.pair_female || ''}
                onChange={handlePairChange}
                fullWidth
                select
              >
                {showFemaleBirds.map((showFemale) => (
                  <MenuItem
                    key={showFemale.id}
                    value={showFemale.band_number || ''}
                    data-species_id={showFemale.species_id}
                  >
                    {showFemale.band_number} - {showFemale.species_name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                margin="normal"
                label="Date of Beginning"
                name="beginning"
                type="datetime-local"
                value={newPairData.beginning || ''}
                onChange={handlePairChange}
                fullWidth
              />

              {/* Notes Field Tab */}
              <TextField
                margin="normal"
                label="Nests"
                name="nests"
                value={newPairData.nests || ''}
                onChange={handlePairChange}
                fullWidth
              />
              <TextField
                margin="normal"
                label="Comments"
                name="comments"
                value={newPairData.comments || ''}
                onChange={handlePairChange}
                fullWidth
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePairModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSavePairs} color="primary">
            {editingPair ? 'Save Changes' : 'Add Bird'}
          </Button>
        </DialogActions>
      </Dialog>

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
      </Stack>

      {pairContent}

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

export default PairsView;
