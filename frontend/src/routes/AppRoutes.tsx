import { createBrowserRouter, Outlet } from "react-router-dom"
import Layout from "../layout/Layout"
import NotFound from "../pages/NotFound"
import UnauthorizedResource from "../pages/UnauthorizedResource"
import Home from '../pages/Home'
import GameModesPage from '../pages/GameModesPage' 

const router = createBrowserRouter([
  {
    path: '/*',
    element: <NotFound />
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedResource />
  },
  {
    path: '/',
    element: <Layout><Outlet /></Layout>,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'game-modes', 
        element: <GameModesPage />
      },
    ]
  },
]);

export default router;
