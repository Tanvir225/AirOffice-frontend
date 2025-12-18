import { createBrowserRouter } from "react-router-dom";
import Home from "../Page/Home/Home";
import Main from "../Layout/Main";
import AddBooking from "../Page/AddBooking/AddBooking";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        errorElement: <div>Not Found</div>,
        children: [
            {
                path: "/",
                element:<Home></Home>
            },
            {
                path: "/add-booking",
                element:<AddBooking></AddBooking>
            },
           
        ]
    }
]);

export default router;