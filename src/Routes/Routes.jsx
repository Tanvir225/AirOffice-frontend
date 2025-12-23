import { createBrowserRouter } from "react-router-dom";
import Home from "../Page/Home/Home";
import Main from "../Layout/Main";
import AddBooking from "../Page/AddBooking/AddBooking";
import BookingsGrid from "../Page/BookingsGrid";
import PaymentPage from "../Page/Payment/PaymentPage";
import AddTopup from "../Page/Topup/AddTopUp";
import TopupLedger from "../Page/Topup/TopupLedger";
import Login from "../Page/Login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    errorElement: <div>Not Found</div>,
    children: [
      {
        path: "/",
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
]);

export default router;
