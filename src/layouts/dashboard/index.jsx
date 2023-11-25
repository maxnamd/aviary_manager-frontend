import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { useStateContext } from 'src/contexts/ContextProvider';
import Nav from './nav';
import Main from './main';
import Header from './header';



// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);
  const { token } = useStateContext();
  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
