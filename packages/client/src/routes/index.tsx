import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/App.layout';
import { ErrorLayout } from '../layouts/Error.layout';
import App from './app/App';
import { NotFountLayout } from '../layouts/NotFound.layout';

const router = createBrowserRouter([
  {
    path: import.meta.env.VITE_BASE,
    element: <AppLayout />,
    errorElement: <ErrorLayout />,
    children: [
      {
        path: '',
        element: <App />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFountLayout />,
  },
]);

export default router;
