import { Link, useNavigate } from "react-router-dom";
import "./Card.scss";
import axios from "axios";

function Card({ item }) {
  const navigate = useNavigate();
  function initiateChat() {
    const postData = {
      receiverId: item.userId,
    };

    axios
      .post("http://localhost:8800/api/chats", postData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Response:", response.data);

        if (response.status !== 500) {
          navigate("/profile");
        }
      })
      .catch((error) => {
        console.error("Error IN initiating the chat:", error);
      });
  }
  //console.log(item)
  return (
    <div className="card">
      <Link to={`/property/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/property/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              <img src="/save.png" alt="" />
            </div>
            <div className="icon">
              <img src="/chat.png" alt="" onClick={initiateChat} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
