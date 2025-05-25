'use client';
const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-[#231E40] relative z-[100]">
            <h1 className="text-4xl font-bold text-white">404 - Page Not Found</h1>
            <p className="text-lg mt-2 text-white">The page you are looking for does not exist.</p>
        </div>
    );
};

export default NotFound;