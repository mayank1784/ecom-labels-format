// rrd imports
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// pages
import Main from "./pages/Main";
import Home from "./pages/Home";
import Error from "./pages/Error";

// stylesheet
import "./stylesheets/App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import SortLabels from "./pages/SortLabels";
import Loading from "./pages/Loading";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      errorElement: <Error screen={"Root-Level"} />,
      children: [
        {
          index: true,
          element: <Home />,
          errorElement: <Error screen={"Home-Page"} />,
        },
        {
          path: "register",
          element: <Register />,
          errorElement: <Error screen={"Register-Page"} />,
        },
        {
          path: "login",
          element: <Login />,
          errorElement: <Error screen={"Login-Page"} />,
        },
        {
          path: "pricing",
          element: <Pricing />,
          errorElement: <Error screen={"Pricing-Page"} />,
        },
        {
          path: "sortlabels/:type",
          element: <SortLabels />,
          errorElement: <Error screen={"SortLabels-Page"} />,
        },
        {
          path: "loading/:id",
          element: <Loading />,
          errorElement: <Error screen={"Loading-Page"} />,
        },
      ]
    }
  ])

  return (
    <div className='app'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
