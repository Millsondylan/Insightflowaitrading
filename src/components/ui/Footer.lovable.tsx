import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ color: "#9CA3AF" }}>
      <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px" }}>
        <p>© {currentYear} Insight Flow</p>
        <div >
          <Link to="/support" style={{ color: "#9CA3AF" }}>
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 