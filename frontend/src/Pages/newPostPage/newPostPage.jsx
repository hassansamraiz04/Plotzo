import { useContext, useEffect, useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/UploadWidget/UploadWidget";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Toast from "../../components/Toast/Toast";
import { getUserId, isSeller } from "../../lib/authz";

const initialForm = {
  title: "",
  price: "",
  address: "",
  city: "",
  bedroom: 1,
  bathroom: 1,
  latitude: "",
  longitude: "",
  type: "rent",
  property: "apartment",
  utilities: "owner",
  pet: "allowed",
  furnished: "furnished",
  income: "",
  size: 0,
  school: 0,
  bus: 0,
  restaurant: 0,
};

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const isSellerUser = isSeller(currentUser);
  const currentUserId = getUserId(currentUser);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isEditMode) return;

    const loadPost = async () => {
      setIsLoadingPost(true);
      setError("");
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        const post = res.data;
        const ownerId = post?.user?.id;

        if (!ownerId || ownerId !== currentUserId) {
          navigate("/unauthorized", { replace: true });
          return;
        }

        setImages(Array.isArray(post.images) ? post.images : []);
        setValue(post.postDetail?.desc || "");
        setForm({
          title: post.title || "",
          price: post.price ?? "",
          address: post.address || "",
          city: post.city || "",
          bedroom: post.bedroom ?? 1,
          bathroom: post.bathroom ?? 1,
          latitude: post.latitude || "",
          longitude: post.longitude || "",
          type: post.type || "rent",
          property: post.property || "apartment",
          utilities: post.postDetail?.utilities || "owner",
          pet: post.postDetail?.pet || "allowed",
          furnished: post.postDetail?.furnished || "furnished",
          income: post.postDetail?.income || "",
          size: post.postDetail?.size ?? 0,
          school: post.postDetail?.school ?? 0,
          bus: post.postDetail?.bus ?? 0,
          restaurant: post.postDetail?.restaurant ?? 0,
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load listing for editing");
      } finally {
        setIsLoadingPost(false);
      }
    };

    loadPost();
  }, [id, isEditMode, currentUserId, navigate]);

  const handleChange = (e) => {
    const { name, value: nextValue } = e.target;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSellerUser) {
      navigate("/unauthorized");
      return;
    }

    if (!images.length) {
      setError("At least one image is required.");
      return;
    }

    setError("");
    setToast("");
    setIsSubmitting(true);

    const payload = {
      postData: {
        title: form.title,
        price: parseInt(form.price),
        address: form.address,
        city: form.city,
        bedroom: parseInt(form.bedroom),
        bathroom: parseInt(form.bathroom),
        type: form.type,
        property: form.property,
        latitude: form.latitude,
        longitude: form.longitude,
        images: images,
      },
      postDetail: {
        desc: value,
        utilities: form.utilities,
        pet: form.pet,
        furnished: form.furnished,
        income: form.income,
        size: parseInt(form.size),
        school: parseInt(form.school),
        bus: parseInt(form.bus),
        restaurant: parseInt(form.restaurant),
      },
    };

    try {
      const res = isEditMode
        ? await apiRequest.put(`/posts/${id}`, payload)
        : await apiRequest.post("/posts", payload);
      setToast(isEditMode ? "Listing updated successfully" : "Listing created successfully");
      navigate("/property/" + res.data.id);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.join(", ") ||
          (isEditMode ? "Failed to update listing" : "Failed to add listing")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSellerUser) {
    return (
      <div className="newPostPage unauthorizedInline">
        <div className="formContainer">
          <div className="wrapper">
            <h1>Unauthorized access</h1>
            <p>Only sellers can create or edit listings.</p>
            <Link to="/unauthorized" className="unauthorizedLink">
              Go to access help
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>{isEditMode ? "Edit Listing" : "Add New Property"}</h1>
        <div className="wrapper">
          {isLoadingPost ? <LoadingSpinner label="Loading listing data..." /> : null}
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" value={form.title} onChange={handleChange} />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" value={form.price} onChange={handleChange} />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" value={form.address} onChange={handleChange} />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" value={form.city} onChange={handleChange} />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" value={form.bedroom} onChange={handleChange} />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" value={form.bathroom} onChange={handleChange} />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" value={form.latitude} onChange={handleChange} />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" value={form.longitude} onChange={handleChange} />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="rent">
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property" value={form.property} onChange={handleChange}>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities" value={form.utilities} onChange={handleChange}>
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet" value={form.pet} onChange={handleChange}>
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="furnished">Furnished</label>
              <select name="furnished" value={form.furnished} onChange={handleChange}>
                <option value="furnished">Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
                value={form.income}
                onChange={handleChange}
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" value={form.size} onChange={handleChange} />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" value={form.school} onChange={handleChange} />
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number" value={form.bus} onChange={handleChange} />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" value={form.restaurant} onChange={handleChange} />
            </div>
            <button className="sendButton" disabled={isSubmitting || isLoadingPost}>
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Publishing..."
                : isEditMode
                ? "Update Listing"
                : "Publish Listing"}
            </button>
            {error && <span>{error}</span>}
            {toast && <Toast message={toast} type="success" />}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "lamadev",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;