// ContextProvider.jsx
import React, { useState, useContext, createContext, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const StateContext = createContext({
  token: null,
  setToken: () => {},
});

export const ContextProvider = ({ children }) => {
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

  const setToken = useCallback(
    (newToken) => {
      _setToken(newToken);
      if (newToken) {
        console.log('Access token generated');
        localStorage.setItem('ACCESS_TOKEN', newToken);
      } else {
        console.log('Access token removed');
        localStorage.removeItem('ACCESS_TOKEN');
      }
    },
    [_setToken]
  );

  const memoizedValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token, setToken]
  );

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/species`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
            Accept: '*/*',
          },
        });
        console.log("Success", response)
      } catch (error) {
        setToken(null);
      }
    };

    fetchSpecies();
  });
  return <StateContext.Provider value={memoizedValue}>{children}</StateContext.Provider>;
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useStateContext = () => useContext(StateContext);
