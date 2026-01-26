import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Error404 from '@/assets/404Page.png';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
            <Link to="/">  
              <img 
                src={Error404} 
                alt="404" 
                className="w-full scale-50 object-contain -translate-x-10 translate-y-5"
            />
            </Link>
      </div>
    </div>
  );
};

export default NotFound;
