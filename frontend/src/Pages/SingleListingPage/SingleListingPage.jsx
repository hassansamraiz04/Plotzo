import "./SingleListingPage.scss";
import Map from "../../components/Map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import { singleData } from "../../lib/dummydata";
import axios from 'axios';

function SingleListingPage() {
  //const post = singleData; //useLoaderData();
  const post = useLoaderData();
  
  const [saved, setSaved] = useState(post.isSaved);
  console.log(saved);
  const [predictedPrice, setPredictedPrice] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const postDataToPredictEndpoint = async () => {
      try {
        const response = await axios.post('http://localhost:8900/predict', post);

        setPredictedPrice((response.data['predicted_price']*0.0036).toFixed(2)); // Handle response data as needed
      } catch (error) {
        console.error('Error:', error);
        // Handle error here
      }
    };

    postDataToPredictEndpoint();
  }, []);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <ImageSlider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price} &nbsp;&nbsp;&nbsp; 
                 {(post.price > predictedPrice) && <i className="bi bi-arrow-up-circle-fill tooltip" onMouseEnter={() => setIsHovered(true)}onMouseLeave={() => setIsHovered(false)}><div className="tooltiptext">
                    Price of this property is higher than our estimated price of $ {predictedPrice}.
                  </div></i>}
                {(post.price <= predictedPrice) && <i className="bi bi-arrow-down-circle-fill tooltip" onMouseEnter={() => setIsHovered(true)}onMouseLeave={() => setIsHovered(false)}><div className="tooltiptext">
                  Price of this property is lower than our estimated price of $ {predictedPrice}.
                  </div></i>}
                </div>
                
              </div>
              <div className="user">
                <img src={post.user.avatar} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail.restaurant}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          {/* <div className="mapContainer">
            <Map items={[
                {...post.postDetail.location, // logitude, latitude, address, city
                    images:[post.images[0]],
                    title: post.title,
                    bedroom: post.postDetail.bedroom,
                    bathroom: post.postDetail.bathroom,
                    price: post.price,
                }
                 ]} />
          </div> */}
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleListingPage;
