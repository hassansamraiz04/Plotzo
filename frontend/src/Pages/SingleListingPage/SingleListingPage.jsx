import "./SingleListingPage.scss";
import Map from "../../components/Map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import Toast from "../../components/Toast/Toast";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { getUserId, isSeller } from "../../lib/authz";

function SingleListingPage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [predictionError, setPredictionError] = useState("");
  const [predicting, setPredicting] = useState(false);
  const [targetLang, setTargetLang] = useState("en");
  const [translatedDesc, setTranslatedDesc] = useState("");
  const [translating, setTranslating] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const currentUserId = getUserId(currentUser);
  const listingOwnerId = post?.user?.id || post?.userId;
  const isOwnerSeller =
    isSeller(currentUser) &&
    currentUserId &&
    listingOwnerId &&
    currentUserId === listingOwnerId;

  useEffect(() => {
    const postDataToPredictEndpoint = async () => {
      setPredicting(true);
      setPredictionError("");
      try {
        const response = await apiRequest.post("/ml/predict", {
          bedroom: post.bedroom,
          bathroom: post.bathroom,
          size: post.postDetail?.size,
          latitude: Number(post.latitude),
          longitude: Number(post.longitude),
          type: post.type,
          property: post.property,
          city: post.city,
        });
        setPredictedPrice(Math.round(response.data.predicted_price || 0));
      } catch (error) {
        setPredictionError("Could not load AI prediction");
      } finally {
        setPredicting(false);
      }
    };

    postDataToPredictEndpoint();
  }, [post]);

  useEffect(() => {
    const run = async () => {
      if (targetLang === "en") {
        setTranslatedDesc("");
        return;
      }
      setTranslating(true);
      try {
        const plain = DOMPurify.sanitize(post.postDetail?.desc || "", {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
        });
        const res = await apiRequest.post("/translate", {
          text: plain,
          sourceLang: "en",
          targetLang,
        });
        setTranslatedDesc(res.data.translated || "");
      } catch {
        setTranslatedDesc("Translation unavailable right now.");
      } finally {
        setTranslating(false);
      }
    };
    run();
  }, [post, targetLang]);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleDelete = async () => {
    if (!isOwnerSeller) return;
    setDeleteLoading(true);
    try {
      await apiRequest.delete(`/posts/${post.id}`);
      setActionSuccess("Listing deleted successfully");
      navigate("/profile");
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to delete listing");
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
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
                <div className="price">
                PKR {post.price.toLocaleString()}
                </div>
                <div>
                  {predicting && <small>Predicting price...</small>}
                  {!predicting && predictionError && <small>{predictionError}</small>}
                  {!predicting && predictedPrice && (
                    <small>
                      AI estimate: PKR {predictedPrice.toLocaleString()} ({post.price > predictedPrice ? "listed above" : "listed below"} estimate)
                    </small>
                  )}
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
            <div style={{ marginTop: 16 }}>
              <label htmlFor="lang">Description language: </label>
              <select id="lang" value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                <option value="en">English</option>
                <option value="ur">Urdu</option>
                <option value="es">Spanish</option>
                <option value="ar">Arabic</option>
              </select>
              {targetLang !== "en" && (
                <p style={{ marginTop: 8 }}>
                  {translating ? "Translating..." : translatedDesc}
                </p>
              )}
            </div>
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
          <button onClick={() => {
  if (!currentUser) { navigate("/login"); return; }
  apiRequest.post("/chats", { receiverId: post.user.id })
    .then(() => navigate("/profile"))
    .catch(err => console.log(err));
}}>
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
            {isOwnerSeller && (
              <>
                <button onClick={() => navigate(`/edit/${post.id}`)}>Edit Listing</button>
                <button onClick={() => setDeleteModalOpen(true)} disabled={deleteLoading}>
                  {deleteLoading ? "Deleting..." : "Delete Listing"}
                </button>
              </>
            )}
          </div>
          {actionError ? <Toast message={actionError} type="error" /> : null}
          {actionSuccess ? <Toast message={actionSuccess} type="success" /> : null}
        </div>
      </div>
      {deleteModalOpen && (
        <ConfirmModal
          title="Delete listing"
          message="This action cannot be undone. Do you want to permanently delete this listing?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setDeleteModalOpen(false)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

export default SingleListingPage;
