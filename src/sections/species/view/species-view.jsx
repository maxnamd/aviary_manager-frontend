import React, { useState, useEffect } from 'react';
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

const SpeciesTable = () => {
  const [speciesData, setSpeciesData] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [newSpecies, setNewSpecies] = useState({
    name: '',
  });

  useEffect(() => {
    const fetchSpeciesData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/species', {
          headers: {
            Authorization: 'Bearer 2|jfe8niTYuo1Dr2h6FwQmJ4obS4LUAmBE1VtMX4af3ef92267',
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
      setNewSpecies({
        name: species.name,
      });
    } else {
      // If adding, clear the input field
      setNewSpecies({
        name: '',
      });
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedSpecies(null);
    setDialogOpen(false);
  };

  const handleDialogSave = async () => {
    try {
      if (selectedSpecies) {
        // If editing, make a put request
        await axios.put(
          `http://localhost:8000/api/v1/species/${selectedSpecies.id}`,
          {
            name: newSpecies.name,
          },
          {
            headers: {
              Authorization: 'Bearer 2|jfe8niTYuo1Dr2h6FwQmJ4obS4LUAmBE1VtMX4af3ef92267',
            },
          }
        );

        // Update the species data in the state
        setSpeciesData((prevData) =>
          prevData.map((species) =>
            species.id === selectedSpecies.id ? { ...species, name: newSpecies.name } : species
          )
        );

        toast.success('Species updated successfully!');
      } else {
        // If adding, make a post request
        const response = await axios.post(
          'http://localhost:8000/api/v1/species',
          {
            name: newSpecies.name,
          },
          {
            headers: {
              Authorization: 'Bearer 2|jfe8niTYuo1Dr2h6FwQmJ4obS4LUAmBE1VtMX4af3ef92267',
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
              await axios.delete(`http://localhost:8000/api/v1/species/${speciesId}`, {
                headers: {
                  Authorization: 'Bearer 2|jfe8niTYuo1Dr2h6FwQmJ4obS4LUAmBE1VtMX4af3ef92267',
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSpecies((prevSpecies) => ({ ...prevSpecies, [name]: value }));
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
          <TextField
            label="Name"
            name="name"
            value={newSpecies.name}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogSave} color="primary">
            {selectedSpecies ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SpeciesTable;
