// birds-v2-view.jsx
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
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import MenuItem from '@mui/material/MenuItem';
import { Tabs, Tab, Box } from '@mui/material';

import { toast, ToastContainer } from 'react-toastify';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

import BirdCard from '../bird-card';
import BirdFilters from '../bird-filter';
import BirdSort from '../bird-sort';
import TabPanel from '../bird-tab-panel';
import 'react-toastify/dist/ReactToastify.css';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

const myToken = localStorage.getItem('ACCESS_TOKEN');
const BirdsV2View = () => {
  console.log(myToken);
  const [birds, setBirds] = useState([]);
  const [isGrid, setIsGrid] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    gender: [],
    status: '',
  });
  const STATUS_OPTIONS = ['Available', 'Deceased', 'Sold', 'Donated'];
  const [tabValue, setTabValue] = React.useState(0);
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [showFemaleBirds, setShowFemaleBirds] = useState([]);
  const [showMaleBirds, setShowMaleBirds] = useState([]);
  const [openBirdModal, setOpenBirdModal] = useState(false);
  const [editingBird, setEditingBird] = useState(null); // null for adding a new bird
  // Function to handle opening and closing of the Add/Edit Bird Modal
  const handleOpenBirdModal = (bird = null) => {
    if (bird !== null) {
      // If editing an existing bird, set the newBirdData state with the bird's data
      setNewBirdData({
        band_number: bird.band_number,
        sex: bird.sex,
        cage_number: bird.cage_number,
        date_of_banding: bird.date_of_banding,
        date_of_birth: bird.date_of_birth,
        notes: bird.notes,
        status: bird.status,
        species_id: bird.species_id,
        origin_mother_band_number: bird.origin_mother_band_number,
        origin_father_band_number: bird.origin_father_band_number,
      });
    } else {
      // If adding a new bird, reset the newBirdData state to its default values
      setNewBirdData({
        band_number: '',
        sex: '',
        cage_number: '',
        date_of_banding: getFormattedDateTime(),
        date_of_birth: getFormattedDateTime(),
        notes: '',
        status: '',
        species_id: '',
        origin_mother_band_number: '',
        origin_father_band_number: '',
      });
    }

    setEditingBird(bird);
    setOpenBirdModal(true);
  };

  const handleCloseBirdModal = () => {
    setEditingBird(null);
    setOpenBirdModal(false);
  };

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/species`, {
          headers: {
            Authorization: `Bearer ${myToken}`,
            Accept: '*/*',
          },
        });
        setSpeciesOptions(response.data.data);
      } catch (error) {
        console.log('Error getting species:', error.response.data.message);
      }
    };

    fetchSpecies();
  }, []);
  const handleChangeTab = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

  useEffect(() => {
    const fetchFemaleBirds = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/birds?sex=F`,
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
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/birds?sex=M`,
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

  const [newBirdData, setNewBirdData] = useState({
    band_number: '',
    sex: '',
    cage_number: '',
    date_of_banding: getFormattedDateTime(),
    date_of_birth: getFormattedDateTime(),
    notes: '',
    status: '',
    species_id: '',
    origin_mother_band_number: '',
    origin_father_band_number: '',
  });

  // State for handling alerts
  const [alert, setAlert] = useState({ open: false, type: 'success', message: '' });
  const [galleryFiles, setGalleryFiles] = useState([]);

  registerPlugin(FilePondPluginFileValidateSize);
  registerPlugin(FilePondPluginImagePreview);

  const fetchData = useCallback(async () => {
    try {
      const genderParam = filters.gender.length > 0 ? `&sex=${filters.gender.join(',')}` : '';
      const statusParam = filters.status ? `&status=${filters.status}` : '';

      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/v1/birds?page=${currentPage}&per_page=10${genderParam}${statusParam}`,
        {
          headers: {
            Authorization: `Bearer ${myToken}`,
          },
        }
      );
      setBirds(response.data.data);
      setTotalPages(response.data.pagination.last_page);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleLayout = () => {
    setIsGrid((prevIsGrid) => !prevIsGrid);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (selectedFilters) => {
    console.log('Filters received:', selectedFilters);
    // Handle the selected filters, you can set it to the state or perform other actions
    setFilters(selectedFilters);
  };

  const handleSortChange = (sortOption) => {
    // Handle the sort option, you can set it to the state or perform other actions
    console.log('Sort option:', sortOption);

    // Trigger a data fetch with the new sorting criteria
    fetchDataWithSort(sortOption);
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const fetchDataWithSort = async (sortOption) => {
    try {
      const genderParam = filters.gender.length > 0 ? `&sex=${filters.gender.join(',')}` : '';
      const statusParam = filters.status ? `&status=${filters.status}` : '';
      const sortParam = sortOption.value ? `&sort=${sortOption.value}` : '';
      const directionParam = sortOption.direction ? `&direction=${sortOption.direction}` : '';

      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/v1/birds?page=${currentPage}&per_page=20${genderParam}${statusParam}${sortParam}${directionParam}`,
        {
          headers: {
            Authorization: `Bearer ${myToken}`,
          },
        }
      );
      setBirds(response.data.data);
      setTotalPages(response.data.pagination.last_page);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
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

  let birdContent;

  if (birds.length > 0) {
    birdContent = isGrid ? (
      <Grid container spacing={3}>
        {birds.map((bird) => (
          <Grid item key={bird.id} xs={12} sm={6} md={4} lg={3}>
            <BirdCard bird={bird} onEdit={handleOpenBirdModal} />
          </Grid>
        ))}
      </Grid>
    ) : (
      <div>
        {birds.map((bird) => (
          <BirdCard key={bird.id} bird={bird} />
        ))}
      </div>
    );
  } else {
    birdContent = <Typography variant="body1">No records found.</Typography>;
  }

  const handleBirdDataChange = (e) => {
    const { name, value } = e.target;
    setNewBirdData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveBird = async () => {
    try {
      // If editingBird is not null, it means we are editing an existing bird
      if (editingBird) {
        try {
          const formData = new FormData();

          // Append newBirdData fields to FormData
          Object.entries(newBirdData).forEach(([key, value]) => {
            formData.append(key, value);
          });

          // Append files to FormData
          galleryFiles.forEach((file, index) => {
            formData.append(`gallery[${index}]`, file);
          });

          // Format date fields
          const formattedDateOfBanding = new Date(newBirdData.date_of_banding)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

          const formattedDateOfBirth = new Date(newBirdData.date_of_birth)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

          // Append formatted date fields to FormData
          formData.append('date_of_banding', formattedDateOfBanding);
          formData.append('date_of_birth', formattedDateOfBirth);

          // Make the PUT request with FormData
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/birds/${editingBird.id}?_method=PUT`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${myToken}`,
              },
            }
          );

          // Close the modal and refresh the data
          setBirds((prevBirds) => {
            // Update the edited bird in the state with the new data
            const updatedBirds = prevBirds.map((prevBird) =>
              prevBird.id === editingBird.id ? { ...prevBird, ...newBirdData } : prevBird
            );
            return updatedBirds;
          });

          setGalleryFiles([]);
          handleCloseBirdModal();

          toast.success('Bird updated successfully!');
        } catch (error) {
          // Handle errors for updating the bird
          console.error('Error updating bird:', error);
          handleSaveError(error);
        }
      } else {
        // If editingBird is null, it means we are adding a new bird
        try {
          const formData = new FormData();

          // Append newBirdData fields to FormData
          Object.entries(newBirdData).forEach(([key, value]) => {
            // Convert species_id to integer before appending
            if (key === 'species_id' && typeof value === 'string') {
              formData.append(key, parseInt(value, 10));
            } else {
              formData.append(key, value);
            }
          });

          // Append files to FormData
          galleryFiles.forEach((file, index) => {
            formData.append(`gallery[${index}]`, file);
          });

          // Format date fields
          const formattedDateOfBanding = new Date(newBirdData.date_of_banding)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

          const formattedDateOfBirth = new Date(newBirdData.date_of_birth)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

          // Append formatted date fields to FormData
          formData.append('date_of_banding', formattedDateOfBanding);
          formData.append('date_of_birth', formattedDateOfBirth);

          // Make the POST request with FormData
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/birds`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${myToken}`,
            },
          });

          // Close the modal and refresh the data
          const birdsResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/birds?page=${currentPage}&per_page=10`,
            {
              headers: {
                Authorization: `Bearer ${myToken}`,
              },
            }
          );

          setBirds(birdsResponse.data.data);
          setNewBirdData({
            band_number: '',
            sex: '',
            cage_number: '',
            date_of_banding: getFormattedDateTime(),
            date_of_birth: getFormattedDateTime(),
            notes: '',
            status: '',
            species_id: '',
            origin_mother_band_number: '',
            origin_father_band_number: '',
          });

          setGalleryFiles([]);
          handleCloseBirdModal();
          setTimeout(() => {
            setAlert({ open: false, type: '', message: '' });
          }, 10000);

          toast.success('Bird added successfully!');
        } catch (error) {
          // Handle errors for adding a new bird
          console.error('Error adding bird:', error);
          handleSaveError(error);
        }
      }
    } catch (error) {
      // Handle other errors
      console.error(error);
    }
  };

  // Helper function to handle common save errors
  const handleSaveError = (error) => {
    if (error.response) {
      const { data } = error.response;
      setAlert({
        open: true,
        type: 'error',
        message: data.message || 'Error processing the request. Please try again.',
      });
      toast.error(data.message || 'Error processing the request. Please try again.');
    } else if (error.request) {
      setAlert({ open: true, type: 'error', message: 'No response from the server.' });
      toast.error('No response from the server.');
    } else {
      setAlert({ open: true, type: 'error', message: 'Unexpected error. Please try again.' });
      toast.error('Unexpected error. Please try again.');
    }
  };

  return (
    <Container>
      <Button
        onClick={toggleLayout}
        variant="outlined"
        color="primary"
        style={{ marginBottom: '10px', margin: '10px' }}
      >
        {isGrid ? 'Switch to List' : 'Switch to Grid'}
      </Button>

      <Button
        variant="outlined"
        color="primary"
        style={{ marginBottom: '10px', margin: '10px' }}
        onClick={() => handleOpenBirdModal(null)}
      >
        Add Bird
      </Button>

      {alert.open && (
        <Alert severity={alert.type} onClose={handleCloseAlert}>
          <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          {alert.message}
        </Alert>
      )}

      {/* Add Bird Modal */}
      <Dialog open={openBirdModal} onClose={handleCloseBirdModal}>
        <DialogTitle>{editingBird ? 'Edit Bird' : 'Add Bird'}</DialogTitle>
        <DialogContent>
          <form>
            <Box sx={{ width: '100%' }}>
              <Tabs
                value={tabValue}
                onChange={handleChangeTab}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
              >
                <Tab label="Main Details" />

                <Tab label="Origin" />
                <Tab label="Genetic" />
                <Tab label="Gallery" />
                <Tab label="Notes" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                {/* Your existing bird details content */}

                <TextField
                  margin="normal"
                  label="Band Number"
                  name="band_number"
                  value={newBirdData.band_number || ''}
                  onChange={handleBirdDataChange}
                  fullWidth
                />

                <TextField
                  margin="normal"
                  label="Sex"
                  name="sex"
                  value={newBirdData.sex || ''}
                  onChange={handleBirdDataChange}
                  fullWidth
                />

                <TextField
                  margin="normal"
                  label="Species"
                  name="species_id"
                  value={newBirdData.species_id || ''}
                  onChange={handleBirdDataChange}
                  fullWidth
                  select
                >
                  {speciesOptions.map((species) => (
                    <MenuItem key={species.id} value={species.id || ''}>
                      {species.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  margin="normal"
                  label="Cage Number"
                  name="cage_number"
                  value={newBirdData.cage_number || ''}
                  onChange={handleBirdDataChange}
                  fullWidth
                />
                <TextField
                  margin="normal"
                  label="Date of Banding"
                  name="date_of_banding"
                  type="datetime-local"
                  value={newBirdData.date_of_banding || ''}
                  onChange={handleBirdDataChange}
                  fullWidth
                />
                <TextField
                  margin="normal"
                  label="Date of Birth"
                  name="date_of_birth"
                  type="datetime-local"
                  value={newBirdData.date_of_birth || ''}
                  onChange={handleBirdDataChange}
                  fullWidth
                />

                <TextField
                  margin="normal"
                  label="Status"
                  name="status"
                  value={newBirdData.status || ''}
                  onChange={handleBirdDataChange}
                  fullWidth
                  select
                >
                  {STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {/* Origin Field Tab */}
                <TextField
                  margin="normal"
                  label="Mother (band number)"
                  name="origin_mother_band_number"
                  value={newBirdData.origin_mother_band_number || ''}
                  onChange={handleBirdDataChange}
                  fullWidth
                  select
                >
                  {showFemaleBirds.map((motherBird) => (
                    <MenuItem key={motherBird.id} value={motherBird.band_number || ''}>
                      {motherBird.band_number}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  margin="normal"
                  label="Father (band number)"
                  name="origin_father_band_number"
                  value={newBirdData.origin_father_band_number || ''}
                  onChange={handleBirdDataChange}
                  fullWidth
                  select
                >
                  {showMaleBirds.map((fatherBird) => (
                    <MenuItem key={fatherBird.id} value={fatherBird.band_number || ''}>
                      {fatherBird.band_number}
                    </MenuItem>
                  ))}
                </TextField>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                {/* Genetic Field Tab */}
                <TextField margin="normal" label="Genotype" name="genotype" fullWidth />

                <TextField margin="normal" label="Phenotype" name="phenotype" fullWidth />

                <TextField margin="normal" label="Mutation" name="mutaion" fullWidth />
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                {/* Gallery Field Tab */}
                {/* Your gallery content */}
                <FilePond
                  files={galleryFiles}
                  allowMultiple
                  maxFiles={5}
                  onupdatefiles={(fileItems) => {
                    setGalleryFiles(fileItems.map((fileItem) => fileItem.file));
                  }}
                  labelIdle="Drop files here or click to browse"
                  allowImagePreview
                  imagePreviewMinHeight={50}
                  imagePreviewMaxHeight={50}
                  imagePreviewHeight={50}
                />
              </TabPanel>

              <TabPanel value={tabValue} index={4}>
                {/* Notes Field Tab */}
                <TextField
                  margin="normal"
                  label="Notes"
                  name="notes"
                  value={newBirdData.notes || ''}
                  onChange={handleBirdDataChange}
                  fullWidth
                />
              </TabPanel>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBirdModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveBird} color="primary">
            {editingBird ? 'Save Changes' : 'Add Bird'}
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
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <BirdFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            onFilterChange={handleFilterChange}
          />

          <BirdSort onSortChange={handleSortChange} />
        </Stack>
      </Stack>

      {birdContent}

      <ToastContainer />

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
