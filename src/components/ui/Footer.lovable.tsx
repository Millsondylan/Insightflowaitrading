import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/60 backdrop-blur py-6 text-gray-400 text-center border-t border-gray-700/30">
      <div className="container mx-auto px-4">
        <p>© {currentYear} Insight Flow</p>
        <div className="mt-2">
          <link to="/support" >
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
export const lovable = { component: true };
