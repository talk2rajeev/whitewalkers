import {
    createBrowserRouter,
    Navigate,
    createHashRouter,
    Routes,
    Route
} from "react-router-dom";
  import {Home} from './pages/home/Home';
  import { Login } from './pages/login/Login';
  import { PlayerList } from "./pages/playerList/PlayerList";
  import {Admin} from './pages/admin/Admin';

  const ProtectedAdminRoute = () => {
    const login = sessionStorage.getItem('login');
    if(!login) {
      return <Navigate to="/" replace />
    }
    return <Admin />
  }

  // const AppRouter = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Login />,
  //   },
  //   {
  //     path: "players",
  //     element: <PlayerList />,
  //   },
  //   {
  //     path: "admin",
  //     element: <ProtectedAdminRoute />,
  //   }
  // ]); 


const AppRouter = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "players",
    element: <PlayerList />,
  },
  {
    path: "admin",
    element: <ProtectedAdminRoute />,
  },
  {
    path: "login",
    element: <Login />,
  },
]);

  export default AppRouter;