// routes/AppRoutes.jsx  
import { createBrowserRouter, Outlet } from "react-router-dom"
import Layout from "../layout/Layout"
// import PrivateRoutes from './PrivateRoutes'
import NotFound from "../pages/NotFound"
import UnauthorizedResource from "../pages/UnauthorizedResource"
import Home from '../pages/Home'
import LeaderboardPage from "../pages/LeaderboardPage" // Import the LeaderboardPage component
// import ProtectedRoutes from "./ProtectedRoutes"
// import Account from "../pages/Account"
import GameModesPage from "../pages/GameModesPage";
import Login from "../pages/Login";

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
    path: "/sign-in",
    element: <Login />,
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
        path: 'leaderboard',
        element: <LeaderboardPage />
      },
      {
        path: "game-modes",
        element: <GameModesPage />,
      },
      // {
      //     element: <PrivateRoutes />,
      //     children: [
      //         {
      //             path: 'account',
      //             element: <Account />
      //         },
      //         {
      //             element: <ProtectedRoutes requiredRole={''} />,
      //             children: [
      //                 // {
      //                 //     path: 'home',
      //                 //     element: <Home />
      //                 // }
      //             ]
      //         }
      //     ]
      // },
    ]
  },

])

export default router;
