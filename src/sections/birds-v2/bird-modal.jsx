// BirdModal.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginFileValidateSize);
registerPlugin(FilePondPluginImagePreview);

const BirdModal = ({ open, onClose, onSubmit, initialData, title }) => {
  const [birdData, setBirdData] = useState(initialData);
  const [galleryFiles, setGalleryFiles] = useState([]);

  useEffect(() => {
    setBirdData(initialData);
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBirdData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileUpload = (fileItems) => {
    setGalleryFiles(fileItems.map((fileItem) => fileItem.file));
  };

  const handleFormSubmit = () => {
    // Format your data or perform any necessary validations before submitting
    // You can then call the onSubmit prop to handle the form submission
    onSubmit(birdData, galleryFiles);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form>
          {/* Add your form fields here */}
          <TextField
            margin="normal"
            label="Band Number"
            name="band_number"
            value={birdData.band_number}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Sex"
            name="sex"
            value={birdData.sex}
            onChange={handleInputChange}
            fullWidth
          />
          {/* ... other form fields ... */}
          <TextField
            margin="normal"
            label="Status"
            name="status"
            value={birdData.status}
            onChange={handleInputChange}
            fullWidth
            select
          >
            {/* Add your status options */}
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Deceased">Deceased</MenuItem>
            <MenuItem value="Sold">Sold</MenuItem>
            <MenuItem value="Donated">Donated</MenuItem>
          </TextField>

          {/* FilePond for image uploads */}
          <FilePond
            files={galleryFiles}
            allowMultiple
            maxFiles={5}
            onupdatefiles={handleFileUpload}
            labelIdle="Drop files here or click to browse"
            allowImagePreview
            imagePreviewMinHeight={50}
            imagePreviewMaxHeight={50}
            imagePreviewHeight={50}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} color="primary">
          {title === 'Edit Bird' ? 'Save Changes' : 'Add Bird'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

BirdModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

export default BirdModal;
