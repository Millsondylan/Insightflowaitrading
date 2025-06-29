import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Footer className="bg-black/60 backdrop-blur py-6 text-gray-400 text-center border-t border-gray-700/30">
      <Div className="container mx-auto px-4">
        <P>© {currentYear} Insight Flow</Footer>
        <Div className="mt-2">
          <Link to="/support" className="text-gray-400 hover:text-cyan-400 transition-colors" /></Div></Div>
            Support
          </Div>
        </Div>
      </Div>
    </Footer>
  );
};

export default Footer;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 