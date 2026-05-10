import "../InfoPage.scss";

function PrivacyPage() {
  return (
    <div className="infoPage">
      <h1>Privacy Policy</h1>
      <p>
        Plotzo stores essential account and listing information to provide search,
        messaging, favorites, and listing management functionality.
      </p>
      <ul>
        <li>Authentication is handled using secure, httpOnly cookies.</li>
        <li>We do not sell your personal information to third parties.</li>
        <li>We collect only the data required to operate the platform.</li>
      </ul>
    </div>
  );
}

export default PrivacyPage;
