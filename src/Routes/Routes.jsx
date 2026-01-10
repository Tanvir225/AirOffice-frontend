import { createBrowserRouter } from "react-router-dom";
import Home from "../Page/Home/Home";
import Main from "../Layout/Main";
import AddBooking from "../Page/AddBooking/AddBooking";
import BookingsGrid from "../Page/BookingsGrid";
import PaymentPage from "../Page/Payment/PaymentPage";
import AddTopup from "../Page/Topup/AddTopUp";
import TopupLedger from "../Page/Topup/TopupLedger";
import FlightInfo from "../Page/FlightInfo/FlightInfo";
import Login from "../Page/Login/Login";
import PrivateRoute from "./PrivateRoute";
import Landing from "../Page/Landing/Landing";
import Land from "../Layout/Land";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Land></Land>,
    children: [
      {
        path: "/",
        element: <Landing></Landing>,
      },
    ],
  },

  {
    path: "flynas",
    element: <PrivateRoute><Main></Main></PrivateRoute>,
    errorElement: <div>Not Found</div>,

    children: [
      {
        path: "/flynas/home",
        element: <Home></Home>
      },
      {
        path: "/flynas/bookings",
        element: <BookingsGrid></BookingsGrid>
      },
      {
        path: "/flynas/add-booking",
        element: <AddBooking></AddBooking>
      },
      {
        path: "/flynas/payment",
        element: <PaymentPage></PaymentPage>
      },
      {
        path: "/flynas/add-topup",
        element: <AddTopup></AddTopup>
      },
      {
        path: "/flynas/topup",
        element: <TopupLedger></TopupLedger>
      },
      {
        path: "/flynas/flight-info",
        element: <FlightInfo></FlightInfo>
      },

    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },

]);

export default router;
