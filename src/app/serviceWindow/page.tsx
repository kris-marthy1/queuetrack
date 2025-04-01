'use client';

import { Suspense } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '../navbar/page';
import { Box, Typography, Button, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

// Utility function to format labels
const formatLabel = (snakeCase: string) => {
  return snakeCase
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Separate component to handle search params
function ServiceWindowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableName = searchParams.get('page'); // Get table name from query params
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [columns, setColumns] = useState<string[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const alertShown = useRef(false); // Track if alert has been shown

  useEffect(() => {
  const tableName = searchParams.get('page')?.toLowerCase(); // Get table name from query params
    const fetchQueueStatus = async () => {
      try {
        const userIP = await axios.get('https://queuetrack.site/fetch-ip');


        const response = await axios.post('https://queuetrack.site/queue-status', {
          table_name: tableName
        });
        
        if (response.data.in_queue) {
          if(
            response.data.in_queue &&
            tableName === response.data.window_name.toLowerCase() &&
            userIP.data.ip_address === response.data.ip_address &&
            !alertShown.current // Check if alert was already shown
          ){
            alert(`You are already in queue for ${tableName}`)
            alertShown.current = true; // Prevent future alerts
            router.push(`/queuePage?page=${tableName}`);
          }
        } 
      } catch (err) {
        console.log('No queue active for the user')
      }
    };

    if (tableName) {
      fetchQueueStatus();
    }
  }, [tableName, router]);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await axios.post('https://queuetrack.site/get-table-columns', {
          table_name: tableName,
        });
        setColumns(response.data);
        // Initialize form data with empty strings for each column
        const initialFormData = response.data.reduce((acc: any, column: string) => {
          acc[column] = '';
          return acc;
        }, {});
        setFormData(initialFormData);
      } catch {
        setError('Failed to fetch table columns. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, [tableName]);


  const handleInputChange = (column: string, value: string) => {
    setFormData((prev) => ({ ...prev, [column]: value }));
    
    // Email validation for fields with "email" in their name
    if (column.toLowerCase().includes('email') && value) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setFormErrors((prev) => ({ ...prev, [column]: 'Please enter a valid email address' }));
      } else {
        setFormErrors((prev) => ({ ...prev, [column]: '' }));
      }
    }
  };

  const handleSubmit = async () => {
    // Validate all email fields
    let isValid = true;
    const newErrors: { [key: string]: string } = {};
    
    Object.keys(formData).forEach(column => {
      if (column.toLowerCase().includes('email')) {
        const value = formData[column];
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value || !emailRegex.test(value)) {
          newErrors[column] = 'PLEASE ENTER A VALID EMAIL ADDRESS!!!';
          isValid = false;
        }
      }
    });
    
    setFormErrors(newErrors);
    
    if (!isValid) {
      return; // Don't submit if validation fails
    }
    
    // Continue with your existing submit logic
    try {
      const response = await axios.post('https://queuetrack.site/join-queue', {
        table_name: tableName,
        ...formData,
      });
  
      if (response.data.message === 'Joined queue successfully') {
        alert('Data submitted successfully!');
        router.push(`/queuePage?page=${tableName}`);
      } else {
        alert('Failed to join queue. Please try again.');
      }
    } catch (error) {
      alert('Failed to submit data. Please try again.');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ textAlign: 'center', marginTop: 6 }}>
          <Typography variant="h5">Loading form...</Typography>
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Box sx={{ textAlign: 'center', marginTop: 6 }}>
          <Typography variant="h4" color="error">
            Error
          </Typography>
          <Typography variant="body1">{error}</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
          gap: 2,
        }}
      >
        <Typography variant="h5" mb={6} mt={2}>
          Fill out the form for: {tableName}
        </Typography>
        {columns.filter(column => column !== 'queue_id').map((column) => {
  if (column === 'priority') {
    return (
      <TextField
        select
        key={column}
        label={formatLabel(column)}
        value={formData[column] === "N/A" ? "None" : (formData[column] || 'None')}
        onChange={(e) => handleInputChange(column, e.target.value)}
        variant="outlined"
        fullWidth
      >
        <MenuItem value="None">None</MenuItem>
        <MenuItem value="PWD">PWD</MenuItem>
        <MenuItem value="Pregnant">Pregnant</MenuItem>
      </TextField>
    );
  } else if (column.toLowerCase().includes('email')) {
    // Special handling for email fields
    return (
      <TextField
        key={column}
        label={formatLabel(column)}
        value={formData[column] || ''}
        onChange={(e) => handleInputChange(column, e.target.value)}
        variant="outlined"
        fullWidth
        type="email"
        error={formErrors && formErrors[column] ? true : false}
        helperText={formErrors && formErrors[column] ? formErrors[column] : ''}
      />
    );
  } else {
    return (
      <TextField
        key={column}
        label={formatLabel(column)}
        value={formData[column] || ''}
        onChange={(e) => handleInputChange(column, e.target.value)}
        variant="outlined"
        fullWidth
      />
    );
  }
})}
 
  
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginTop: '1rem' }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
  
}

export default function ServiceWindow() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceWindowContent />
    </Suspense>
  );
}
