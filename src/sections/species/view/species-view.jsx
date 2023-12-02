import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'; // Import the confirmation dialog

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import the confirmation dialog styles

const myToken = localStorage.getItem('ACCESS_TOKEN');

const SpeciesTable = () => {
  const [speciesData, setSpeciesData] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchSpeciesData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/species`, {
          headers: {
            Authorization: `Bearer ${myToken}`,
          },
        });
        setSpeciesData(response.data.data);
      } catch (error) {
        console.error('Error fetching species data:', error);
      }
    };

    fetchSpeciesData();
  }, []);

  const handleDialogOpen = (species) => {
    if (species) {
      // If editing, set the selected species and populate the input field
      setSelectedSpecies(species);
      setValue('name', species.name);
    } else {
      // If adding, clear the input field
      setSelectedSpecies(null);
      reset();
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedSpecies(null);
    setDialogOpen(false);
  };

  const handleDialogSave = async (data) => {
    try {
      if (selectedSpecies) {
        // If editing, make a put request
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/species/${selectedSpecies.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${myToken}`,
            },
          }
        );

        // Update the species data in the state
        setSpeciesData((prevData) =>
          prevData.map((species) =>
            species.id === selectedSpecies.id ? { ...species, ...data } : species
          )
        );

        toast.success('Species updated successfully!');
      } else {
        // If adding, make a post request
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/species`,
          data,
          {
            headers: {
              Authorization: `Bearer ${myToken}`,
            },
          }
        );

        // Add the new species to the state
        setSpeciesData((prevData) => [...prevData, response.data.data]);
        toast.success('Species added successfully!');
      }

      handleDialogClose();
    } catch (error) {
      console.error('Error saving species:', error);
      toast.error('Error saving species:', error);
    }
  };

  const handleDeleteClick = (speciesId) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this species?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/species/${speciesId}`, {
                headers: {
                  Authorization: `Bearer ${myToken}`,
                },
              });
              // Remove the deleted species from the state
              setSpeciesData((prevData) => prevData.filter((species) => species.id !== speciesId));
              toast.success('Species deleted successfully!');
            } catch (error) {
              console.error('Error deleting species:', error);
            }
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <>
      <ToastContainer />
      <Typography variant="h5" gutterBottom>
        Species Table
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleDialogOpen()}
        style={{ marginBottom: '10px' }}
      >
        Add Species
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {speciesData.map((species) => (
              <TableRow key={species.id}>
                <TableCell>{species.id}</TableCell>
                <TableCell>{species.name}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDialogOpen(species)}>Edit</Button>
                  <Button onClick={() => handleDeleteClick(species.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Species Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{selectedSpecies ? 'Edit' : 'Add'} Species</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(handleDialogSave)}>
            <TextField
              label="Name"
              name="name"
              {...register('name', { required: 'This field is required' })}
              error={Boolean(errors.name)}
              helperText={errors.name && errors.name.message}
              fullWidth
            />
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {selectedSpecies ? 'Save' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpeciesTable;
