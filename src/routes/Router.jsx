import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "../components/Main.jsx";
import App from "../App.jsx";
import SubwayLinePath from "../components/SubwayLinePath.jsx";
import SubwayStationList from "../components/station/SubwayStationList.jsx";
import SubwayStationDetail from "../components/station/SubwayStationDetail.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        index: true,
        element: <Main />
      },
      {
        path: 'line-diagrams',
        element: <SubwayLinePath />
      },
      {
        path: 'stations',
        element: <SubwayStationList />
      },
      {
        path: 'stations/:stationId',
        element: <SubwayStationDetail />
      },
    ]
  }
]);

function Router() {
  return <RouterProvider router={router} />
}

export default Router;