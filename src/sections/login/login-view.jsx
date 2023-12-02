import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

// import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useStateContext } from '../../contexts/ContextProvider';
import 'react-toastify/dist/ReactToastify.css';
// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  // const router = useRouter();

  // State for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0); // Track failed login attempts
  const [isButtonDisabled, setButtonDisabled] = useState(false); // Disable login button
  const { setToken } = useStateContext();
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };

  const showToast = (message, type) => {
    // toast[type](message);
    toast[type](message, {
      onClose: () => console.log("Toast closed")
    });
  };
  // Update email state when the value changes
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Update password state when the value changes
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleClick = async () => {
    console.log('Email:', email);
    console.log('Password:', password);

    const payload = {
      email: `${email}`,
      password: `${password}`,
    };

    console.log('Payload:', payload);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/login`,
        new URLSearchParams(payload).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      showToast('Login success!', 'success');

      // Show toast 5 seconds before setting the token
      setTimeout(() => {
        setToken(response.data.access_token);
        console.log('Access token:', response.data.access_token);
      }, 2000);
    } catch (error) {
      setFailedAttempts((prevAttempts) => prevAttempts + 1);

      if (failedAttempts >= 2) {
        // If 3 or more failed attempts, disable the button for 30 seconds
        setButtonDisabled(true);
        setTimeout(() => {
          setButtonDisabled(false);
          setFailedAttempts(0); // Reset failed attempts after cooldown
        }, 30000);
      }

      if (error.response && error.response.data && error.response.data.message) {
        showToast(error.response.data.message, 'error');
      } else {
        showToast('An unexpected error occurred. Please try again later', 'error');
      }
    }
  };

  const renderForm = (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnHover
        theme="light"
      />
      <Stack spacing={3}>
        {/* Use the value and onChange props to control the TextField components */}
        <TextField name="email" label="Email address" value={email} onChange={handleEmailChange} onKeyPress={handleKeyPress}/>

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={password}
          onChange={handlePasswordChange}
          onKeyPress={handleKeyPress}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        onKeyPress={handleKeyPress}
        disabled={isButtonDisabled}
      >
        {isButtonDisabled ? 'Please wait...' : 'Login'}
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign in to Minimal</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link>
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
