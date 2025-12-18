import { Outlet } from "react-router-dom";



const Main = () => {
    return (
        <div className="w-full mx-auto p-3 lg:max-w-6xl xl:max-w-7xl grid grid-cols-12 gap-5">
            <div className="col-span-full md:col-span-3 ">
                {/* <Sidebar></Sidebar> */}
            </div>
            <div className="col-span-full md:col-span-9  h-[97vh]">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Main;