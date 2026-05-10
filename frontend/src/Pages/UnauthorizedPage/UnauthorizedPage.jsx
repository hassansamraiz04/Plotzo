import { Link } from "react-router-dom";
import "./UnauthorizedPage.scss";

function UnauthorizedPage() {
  return (
    <div className="unauthorizedPage">
      <h1>Unauthorized Access</h1>
      <p>
        You do not have permission to access this page. Seller account is required
        for listing management.
      </p>
      <Link to="/listings" className="backButton">
        Browse Listings
      </Link>
    </div>
  );
}

export default UnauthorizedPage;
