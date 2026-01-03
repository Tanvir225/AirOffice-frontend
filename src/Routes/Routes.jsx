import { createBrowserRouter } from "react-router-dom";
import Home from "../Page/Home/Home";
import Main from "../Layout/Main";
import AddBooking from "../Page/AddBooking/AddBooking";
import BookingsGrid from "../Page/BookingsGrid";
import PaymentPage from "../Page/Payment/PaymentPage";
import AddTopup from "../Page/Topup/AddTopUp";
import TopupLedger from "../Page/Topup/TopupLedger";
<<<<<<< HEAD
import FlightInfo from "../Page/FlightInfo/FlightInfo";

=======
import Login from "../Page/Login/Login";
>>>>>>> 4ff7c8b7312dfeed61fd0f141a228aaed0bd0b1b

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    errorElement: <div>Not Found</div>,
    children: [
      {
        path: "/",
<<<<<<< HEAD
        element: <Main></Main>,
        errorElement: <div>Not Found</div>,
        children: [
            {
                path: "/",
                element:<Home></Home>
            },
            {
                path: "/bookings",
                element:<BookingsGrid></BookingsGrid>
            },
            {
                path: "/add-booking",
                element:<AddBooking></AddBooking>
            },
            {
                path: "/payment",
                element:<PaymentPage></PaymentPage>
            },
            {
                path: "/add-topup",
                element:<AddTopup></AddTopup>
            },
            {
                path: "/topup",
                element:<TopupLedger></TopupLedger>
            },
            {
                path: "/flight-info",
                element:<FlightInfo></FlightInfo>
            },
           
        ]
    }
=======
        element: <Home></Home>,
      },
      {
        path: "/bookings",
        element: <BookingsGrid></BookingsGrid>,
      },
      {
        path: "/add-booking",
        element: <AddBooking></AddBooking>,
      },
      {
        path: "/payment",
        element: <PaymentPage></PaymentPage>,
      },
      {
        path: "/add-topup",
        element: <AddTopup></AddTopup>,
      },
      {
        path: "/topup",
        element: <TopupLedger></TopupLedger>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
>>>>>>> 4ff7c8b7312dfeed61fd0f141a228aaed0bd0b1b
]);

export default router;
