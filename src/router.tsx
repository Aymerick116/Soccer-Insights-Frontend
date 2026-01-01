import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MatchPreview from './pages/MatchPreview';
import TeamPage from './pages/TeamPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'match/:matchId',
        element: <MatchPreview />,
      },
      {
        path: 'team/:id',
        element: <TeamPage />,
      },
    ],
  },
]);

