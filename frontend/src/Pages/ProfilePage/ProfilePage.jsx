import Chat from "../../components/Chat/chat";
import List from "../../components/list/List";
import "./ProfilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/EmptyState/EmptyState";
import { getUserRole, isSeller } from "../../lib/authz";

function ProfilePage() {
  const data = useLoaderData();

  const { updateUser, currentUser } = useContext(AuthContext);
  const isSellerUser = isSeller(currentUser);
  const roleLabel = getUserRole(currentUser) || "BUYER";

  const navigate = useNavigate();

  const handleLogout = async () => {
    alert("Logging Out....");
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <span>
              Role: <b>{roleLabel}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My List</h1>
            {isSellerUser ? (
              <Link to="/add">
                <button>Create New Post</button>
              </Link>
            ) : (
              <span>Seller account required to create listings</span>
            )}
          </div>
          <Suspense fallback={<LoadingSpinner label="Loading your listings..." />}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                postResponse.data.userPosts.length ? (
                  <List posts={postResponse.data.userPosts} />
                ) : (
                  <EmptyState
                    title="No listings found"
                    subtitle={
                      isSellerUser
                        ? "You have not posted any listings yet."
                        : "Buyer accounts do not have listing posts."
                    }
                  />
                )
              }
            </Await>
          </Suspense>
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<LoadingSpinner label="Loading favorites..." />}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                postResponse.data.savedPosts.length ? (
                  <List posts={postResponse.data.savedPosts} />
                ) : (
                  <EmptyState
                    title="No favorites yet"
                    subtitle="Save listings to view them here."
                  />
                )
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<LoadingSpinner label="Loading chats..." />}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
