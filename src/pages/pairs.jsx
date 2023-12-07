import { Helmet } from 'react-helmet-async';

import { PairsView } from 'src/sections/pairs/view';

// ----------------------------------------------------------------------

export default function PairsPage() {
  return (
    <>
      <Helmet>
        <title> Pairs | Minimal UI </title>
      </Helmet>

      <PairsView />
    </>
  );
}
