import { Helmet } from 'react-helmet-async';

import { SpeciesView } from 'src/sections/species/view';

// ----------------------------------------------------------------------

export default function SpeciesPage() {
  return (
    <>
      <Helmet>
        <title> Species | Minimal UI </title>
      </Helmet>

      <SpeciesView />
    </>
  );
}
