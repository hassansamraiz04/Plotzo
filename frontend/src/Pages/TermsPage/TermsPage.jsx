import "../InfoPage.scss";

function TermsPage() {
  return (
    <div className="infoPage">
      <h1>Terms of Service</h1>
      <p>
        By using Plotzo, you agree to provide accurate property information and
        comply with local laws. Misleading listings and abusive behavior can lead
        to account restriction.
      </p>
      <ul>
        <li>Only sellers can create, edit, and delete listings.</li>
        <li>Users are responsible for the authenticity of submitted data.</li>
        <li>Plotzo may suspend accounts violating platform policies.</li>
      </ul>
    </div>
  );
}

export default TermsPage;
