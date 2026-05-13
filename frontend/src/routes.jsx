import App from "./App";
import StartPage from "./pages/StartPage/StartPage";
import GamePage from "./pages/GamePage/GamePage";
import LeaderboardPage from "./pages/LeaderboardPage/LeaderboardPage";
import ErrorPage from "./pages/error-page";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <StartPage /> },
      { path: "game", element: <GamePage /> },
      { path: "leaderboard", element: <LeaderboardPage /> },
    ],
  },
];

export default routes;