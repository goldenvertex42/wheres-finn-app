import App from "./App";
import StartPage from "./pages/StartPage/StartPage";
import GamePage from "./pages/GamePage/GamePage";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import ErrorPage from "./pages/error-page";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <StartPage /> },
      { path: "game", element: <GamePage /> },
      { path: "leaderboard", element: <Leaderboard /> },
    ],
  },
];

export default routes;