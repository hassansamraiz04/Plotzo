import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./HomePage.scss";
//import VerticalCard from "../../components/VerticalCard/VerticalCard";
import VerticalCard from "../../components/VerticalCard/VerticalCard";
import { listData } from "../../lib/dummydata";
import Footer from "../../components/Footer/Footer";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  console.log(listData);
  return (
    <div className="home-wrapper">
      <div className="homePage">
        <div className="textContainer">
          <div className="wrapper">
            <h1 className="title">Find Real Estate & Get Your Dream Place</h1>
            <p>
              Your gateway to finding real estate and securing your dream place.
              Explore our diverse listings and embark on the journey to finding
              the perfect home that truly reflects your aspirations and
              lifestyle.!
            </p>
            <SearchBar />
            <div className="boxes">
              <div className="box">
                <h1>16+</h1>
                <h2>Years of Experience</h2>
              </div>
              <div className="box">
                <h1>200</h1>
                <h2>Award Gained</h2>
              </div>
              <div className="box">
                <h1>2000+</h1>
                <h2>Property Ready</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="imgContainer">
          <img src="/bg.png" alt="" />
        </div>
      </div>
      <div className="separator">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
      <br />
      <br />
      <h1>Top Properties</h1>
      <br />
      <div className="properties-list">
        <br />
        <br />
        {listData.map((list) => {
          if (list.type === "Sale") {
            return <VerticalCard item={list} />;
          }
        })}
      </div>
      <br />
      <h1>Top Rental Properties</h1>
      <br />
      <div className="properties-list">
        <br />
        {listData.map((list) => {
          if (list.type === "Rent") {
            return <VerticalCard item={list} />;
          }
        })}
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
