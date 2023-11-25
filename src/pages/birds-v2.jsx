import { Helmet } from 'react-helmet-async';

import { BirdsV2View } from 'src/sections/birds-v2/view';

// ----------------------------------------------------------------------

export default function BirdsV2Page() {
  return (
    <>
      <Helmet>
        <title> Products | Minimal UI </title>
      </Helmet>

      <BirdsV2View />
    </>
  );
}
