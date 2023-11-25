import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { useStateContext } from 'src/contexts/ContextProvider';

import { LoginView } from 'src/sections/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  const { token } = useStateContext();
  if (token) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <>
      <Helmet>
        <title> Login | Minimal UI </title>
      </Helmet>

      <LoginView />
    </>
  );
}
