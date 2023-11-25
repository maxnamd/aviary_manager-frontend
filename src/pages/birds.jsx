import { Helmet } from 'react-helmet-async';

import { BirdsView } from 'src/sections/birds/view';

// ----------------------------------------------------------------------

export default function BirdsPage() {
  return (
    <>
      <Helmet>
        <title> Products | Minimal UI </title>
      </Helmet>

      <BirdsView />
    </>
  );
}
