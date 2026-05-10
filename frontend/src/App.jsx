import HomePage from "./Pages/HomePage/HomePage";
import {
  Layout,
  RequireAuth,
  RequireSeller,
} from "./Pages/Layout/Layout";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ListPage from "./Pages/ListPage/ListPage";
import UploadWidget from "./components/UploadWidget/UploadWidget";
import SingleListingPage from "./Pages/SingleListingPage/SingleListingPage";
import AboutPage from "./Pages/AboutPage/About";
import ContactPage from "./Pages/ContactPage/ContactPage";
import PrivacyPage from "./Pages/PrivacyPage/PrivacyPage";
import TermsPage from "./Pages/TermsPage/TermsPage";
import DisclaimerPage from "./Pages/DisclaimerPage/DisclaimerPage";
import Login from "./Pages/Login/Login";
import SignUpPage from "./Pages/SignUpPage/SignUpPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import ProfileUpdatePage from "./Pages/UpdateProfilePage/UpdateProfilePage";
import NewPostPage from "./Pages/newPostPage/newPostPage";
import UnauthorizedPage from "./Pages/UnauthorizedPage/UnauthorizedPage";

import {
  listPageLoader,
  profilePageLoader,
  singlePageLoader,
} from "./lib/loaders";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },

        {
          path: "test",
          element: <UploadWidget />,
        },

        {
          path: "listings",
          element: <ListPage />,
          loader: listPageLoader,
        },

        {
          path: "property/:id",
          element: <SingleListingPage />,
          loader: singlePageLoader,
        },

        {
          path: "aboutus",
          element: <AboutPage />,
        },

        {
          path: "contact",
          element: <ContactPage />,
        },

        {
          path: "privacy",
          element: <PrivacyPage />,
        },

        {
          path: "terms",
          element: <TermsPage />,
        },

        {
          path: "disclaimer",
          element: <DisclaimerPage />,
        },

        {
          path: "unauthorized",
          element: <UnauthorizedPage />,
        },

        {
          path: "login",
          element: <Login />,
        },

        {
          path: "register",
          element: <SignUpPage />,
        },

        // Protected Routes With Navbar
        {
          element: <RequireAuth />,
          children: [
            {
              path: "profile",
              element: <ProfilePage />,
              loader: profilePageLoader,
            },

            {
              path: "profile/update",
              element: <ProfileUpdatePage />,
            },
          ],
        },

        // Seller Routes With Navbar
        {
          element: <RequireSeller />,
          children: [
            {
              path: "add",
              element: <NewPostPage />,
            },

            {
              path: "edit/:id",
              element: <NewPostPage />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;