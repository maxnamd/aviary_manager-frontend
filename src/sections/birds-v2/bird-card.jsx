// Bird Card

import axios from 'axios';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Label from 'src/components/label';
import Mock1 from 'src/components/mock-images/mock1.jpg';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'react-toastify/dist/ReactToastify.css';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Helper function to format date
const getFormattedDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `0${now.getMonth() + 1}`.slice(-2);
  const day = `0${now.getDate()}`.slice(-2);
  const hours = `0${now.getHours()}`.slice(-2);
  const minutes = `0${now.getMinutes()}`.slice(-2);
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
registerPlugin(FilePondPluginFileValidateSize);
registerPlugin(FilePondPluginImagePreview);

export default function BirdCard({ bird, setBirds, toast, setAlert }) {
  const [openEditBirdModal, setOpenEditBirdModal] = useState(false);
  const [newBirdData, setNewBirdData] = useState({
    band_number: bird.band_number,
    sex: bird.sex,
    cage_number: bird.cage_number,
    date_of_banding: getFormattedDateTime(),
    date_of_birth: getFormattedDateTime(),
    notes: bird.notes,
    status: bird.status,
  });
  const [galleryFiles, setGalleryFiles] = useState([]);

  const handleOpenEditBirdModal = () => {
    console.log('Edit Bird Data:', bird);
    setOpenEditBirdModal(true);
  };

  const handleCloseEditBirdModal = () => {
    setOpenEditBirdModal(false);
  };

  const handleEditBird = async () => {
    try {
      // Create FormData object
      const formData = new FormData();

      // Append newBirdData fields to FormData
      Object.entries(newBirdData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      console.log('Edit Bird Data:', formData);

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
      await axios.post(`http://localhost:8000/api/v1/birds/${bird.id}?_method=PUT`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer 2|jfe8niTYuo1Dr2h6FwQmJ4obS4LUAmBE1VtMX4af3ef92267',
        },
      });

      // Close the modal and refresh the data
      setBirds((prevBirds) => {
        // Update the edited bird in the state with the new data
        const updatedBirds = prevBirds.map((prevBird) =>
          prevBird.id === bird.id ? { ...prevBird, ...newBirdData } : prevBird
        );
        return updatedBirds;
      });

      // Clear form fields and files
      // setNewBirdData({
      //   band_number: '',
      //   sex: '',
      //   cage_number: '',
      //   date_of_banding: getFormattedDateTime(),
      //   date_of_birth: getFormattedDateTime(),
      //   notes: '',
      //   status: '',
      // });
      setGalleryFiles([]);

      handleCloseEditBirdModal();

      // Display success message
      toast.success('Bird updated successfully!');
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        const { data } = error.response;

        // Use the error message from the response
        setAlert({
          open: true,
          type: 'error',
          message: data.message || 'Error updating bird. Please try again.',
        });
        toast.error(data.message || 'Error updating bird. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        setAlert({ open: true, type: 'error', message: 'No response from the server.' });
        toast.error('No response from the server.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setAlert({ open: true, type: 'error', message: 'Unexpected error. Please try again.' });
        toast.error('No response from the server.');
      }
      console.error('Error updating bird:', error);
    }
  };

  const handleNewBirdDataChange = (e) => {
    const { name, value } = e.target;

    // Check if the value is null, and replace it with an empty string
    const sanitizedValue = value === null ? '' : value;

    setNewBirdData((prevData) => {
      console.log(`Previous ${name} value: ${prevData[name]}, New value: ${sanitizedValue}`);
      return { ...prevData, [name]: sanitizedValue };
    });
  };

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
        <Button onClick={handleOpenEditBirdModal}>Edit Bird</Button>
      </Stack>

      <Dialog open={openEditBirdModal} onClose={handleCloseEditBirdModal}>
        <DialogTitle>Edit Bird</DialogTitle>
        <DialogContent>
          <form>
            {/* Other fields */}
            <TextField
              margin="normal"
              label="Band Number"
              name="band_number"
              value={newBirdData.band_number || ''}
              onChange={handleNewBirdDataChange}
              fullWidth
            />
            <TextField
              margin="normal"
              label="Sex"
              name="sex"
              value={newBirdData.sex || ''}
              onChange={handleNewBirdDataChange}
              fullWidth
            />
            <TextField
              margin="normal"
              label="Cage Number"
              name="cage_number"
              value={newBirdData.cage_number || ''}
              onChange={handleNewBirdDataChange}
              fullWidth
            />
            <TextField
              margin="normal"
              label="Date of Banding"
              name="date_of_banding"
              type="datetime-local"
              value={newBirdData.date_of_banding || ''}
              onChange={handleNewBirdDataChange}
              fullWidth
            />
            <TextField
              margin="normal"
              label="Date of Birth"
              name="date_of_birth"
              type="datetime-local"
              value={newBirdData.date_of_birth || ''}
              onChange={handleNewBirdDataChange}
              fullWidth
            />
            <TextField
              margin="normal"
              label="Notes"
              name="notes"
              value={newBirdData.notes || ''}
              onChange={handleNewBirdDataChange}
              fullWidth
            />

            {/* Status dropdown */}
            <TextField
              margin="normal"
              label="Status"
              name="status"
              value={newBirdData.status || ''}
              onChange={handleNewBirdDataChange}
              fullWidth
              select
            >
              {['Available', 'Deceased', 'Sold', 'Donated'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            {/* FilePond for gallery images */}
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
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditBirdModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditBird} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

BirdCard.propTypes = {
  bird: PropTypes.object,
  toast: PropTypes.func, // Assuming this is from react-toastify
  setAlert: PropTypes.func,
  setBirds: PropTypes.func,
};
