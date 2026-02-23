


const ErrorPage = () => {
    return (
        <div className="bg-black">
            

            <div className="min-h-screen flex flex-col items-center justify-center bg-black-50 px-4">
                <h1 className="text-9xl font-extrabold text-teal-400">404</h1>
                <h2 className="mt-4 text-2xl md:text-3xl font-bold text-teal-300">
                    Oops! Page not found
                </h2>
                <p className="mt-2 text-gray-300 text-center max-w-md animate-pulse">
                    The page you are looking for doesn't exist.
                </p>

                
            </div>
        </div>
    );
};

export default ErrorPage;