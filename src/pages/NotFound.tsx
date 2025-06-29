import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Div className="text-center">
        <H1 className="text-4xl font-bold mb-4"></Div></Div>404</Div>
        <P className="text-xl text-gray-600 mb-4">Oops! Page not found</P>
        <A href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </A>
      </Div>
    </Div>
  );
};

export default NotFound;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
