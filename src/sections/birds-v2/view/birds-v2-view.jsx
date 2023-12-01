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

const BirdsV2View = () => {
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

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/species', {
          headers: {
            Authorization: 'Bearer 2|jfe8niTYuo1Dr2h6FwQmJ4obS4LUAmBE1VtMX4af3ef92267',
          },
        });
        setSpeciesOptions(response.data.data);
      } catch (error) {
        console.error('Error fetching species:', error);
        // Handle the error appropriately, e.g., show an error message to the user
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
        const response = await axios.get('http://localhost:8000/api/v1/birds?sex=F', {
          headers: {
            Authorization: 'Bearer 2|jfe8niTYuo1Dr2h6FwQmJ4obS4LUAmBE1VtMX4af3ef92267',
          },
        });
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
        const response = await axios.get('http://localhost:8000/api/v1/birds?sex=M', {
          headers: {
            Authorization: 'Bearer 2|jfe8niTYuo1Dr2h6FwQmJ4obS4LUAmBE1VtMX4af3ef92267',
          },
        });
        const maleBirdsData = response.data.data;
        setShowMaleBirds(maleBirdsData);
      } catch (error) {
        console.error('Error fetching female birds:', error);
        // Handle the error appropriately, e.g., show an error message to the user
      }
    };

    fetchMaleBirds();
  }, []);

  // State for Add Bird Modal
  const [openAddBirdModal, setOpenAddBirdModal] = useState(false);
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
        `http://localhost:8000/api/v1/birds?page=${currentPage}&per_page=20${genderParam}${statusParam}${sortParam}${directionParam}`,
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

  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  // Function to handle opening and closing of the Add Bird Modal
  const handleOpenAddBirdModal = () => {
    setOpenAddBirdModal(true);
  };

  const handleCloseAddBirdModal = () => {
    setOpenAddBirdModal(false);
  };

  // Function to handle input changes in the Add Bird Modal
  const handleNewBirdDataChange = (e) => {
    const { name, value } = e.target;
    setNewBirdData((prevData) => ({ ...prevData, [name]: value }));
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

  // Function to handle adding a new bird
  const handleAddBird = async () => {
    try {
      // Create FormData object
      const formData = new FormData();

      console.log('Formdata: ', formData);
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
      await axios.post('http://localhost:8000/api/v1/birds', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer 2|jfe8niTYuo1Dr2h6FwQmJ4obS4LUAmBE1VtMX4af3ef92267',
        },
      });

      // Close the modal and refresh the data
      // setBirds((prevBirds) => [...prevBirds]);
      const birdsResponse = await axios.get(`http://localhost:8000/api/v1/birds?page=${currentPage}&per_page=20`, {
        headers: {
          Authorization: 'Bearer 2|jfe8niTYuo1Dr2h6FwQmJ4obS4LUAmBE1VtMX4af3ef92267',
        },
      });
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
      handleCloseAddBirdModal();
      setTimeout(() => {
        setAlert({ open: false, type: '', message: '' });
      }, 10000);
      toast.success('Bird added successfully!');
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        const { data } = error.response;

        // Use the error message from the response
        setAlert({
          open: true,
          type: 'error',
          message: data.message || 'Error adding bird. Please try again.',
        });
        toast.error(data.message || 'Error adding bird. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        setAlert({ open: true, type: 'error', message: 'No response from the server.' });
        toast.error('No response from the server.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setAlert({ open: true, type: 'error', message: 'Unexpected error. Please try again.' });
        toast.error('No response from the server.');
      }
      console.error('Error adding bird:', error);
    }
  };

  let birdContent;

  if (birds.length > 0) {
    birdContent = isGrid ? (
      <Grid container spacing={3}>
        {birds.map((bird) => (
          <Grid item key={bird.id} xs={12} sm={6} md={4} lg={3}>
            <BirdCard bird={bird} setBirds={setBirds} toast={toast} setAlert={setAlert} showFemaleBirds={showFemaleBirds} showMaleBirds={showMaleBirds} TabPanel={TabPanel} speciesOptions={speciesOptions}/>
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
        onClick={handleOpenAddBirdModal}
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
      <Dialog open={openAddBirdModal} onClose={handleCloseAddBirdModal}>
        <DialogTitle>Add Bird</DialogTitle>
        <DialogContent>
          <form>
            <Box sx={{ width: '100%' }}>
              <Tabs value={tabValue} onChange={handleChangeTab}>
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
                  value={newBirdData.band_number}
                  onChange={handleNewBirdDataChange}
                  fullWidth
                />

                <TextField
                  margin="normal"
                  label="Sex"
                  name="sex"
                  value={newBirdData.sex}
                  onChange={handleNewBirdDataChange}
                  fullWidth
                />

                <TextField
                  margin="normal"
                  label="Species"
                  name="species_id"
                  value={newBirdData.species_id}
                  onChange={handleNewBirdDataChange}
                  fullWidth
                  select
                >
                  {speciesOptions.map((species) => (
                    <MenuItem key={species.id} value={species.id}>
                      {species.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  margin="normal"
                  label="Cage Number"
                  name="cage_number"
                  value={newBirdData.cage_number}
                  onChange={handleNewBirdDataChange}
                  fullWidth
                />
                <TextField
                  margin="normal"
                  label="Date of Banding"
                  name="date_of_banding"
                  type="datetime-local"
                  value={newBirdData.date_of_banding}
                  onChange={handleNewBirdDataChange}
                  fullWidth
                />
                <TextField
                  margin="normal"
                  label="Date of Birth"
                  name="date_of_birth"
                  type="datetime-local"
                  value={newBirdData.date_of_birth}
                  onChange={handleNewBirdDataChange}
                  fullWidth
                />

                <TextField
                  margin="normal"
                  label="Status"
                  name="status"
                  value={newBirdData.status}
                  onChange={handleNewBirdDataChange}
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
                  value={newBirdData.origin_mother_band_number}
                  onChange={handleNewBirdDataChange}
                  fullWidth
                  select
                >
                  {showFemaleBirds.map((motherBird) => (
                    <MenuItem key={motherBird.id} value={motherBird.band_number}>
                      {motherBird.band_number}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  margin="normal"
                  label="Father (band number)"
                  name="origin_father_band_number"
                  value={newBirdData.origin_father_band_number}
                  onChange={handleNewBirdDataChange}
                  fullWidth
                  select
                >
                  {showMaleBirds.map((fatherBird) => (
                    <MenuItem key={fatherBird.id} value={fatherBird.band_number}>
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
                  value={newBirdData.notes}
                  onChange={handleNewBirdDataChange}
                  fullWidth
                />
              </TabPanel>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddBirdModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddBird} color="primary">
            Add Bird
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
