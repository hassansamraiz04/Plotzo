import "./LoadingSpinner.scss";

function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="loadingSpinner" role="status" aria-live="polite">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
