import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Birds Manager',
    path: '/birds-v2',
    icon: icon('ic_birds-2'),
  },
  {
    title: 'Species',
    path: '/species',
    icon: icon('ic_birds'),
  },
  {
    title: 'Pairs Manager',
    path: '/pairs',
    icon: icon('ic_birds'),
  },
  {
    title: 'birds - Alpha',
    path: '/birds',
    icon: icon('ic_birds-colored'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
