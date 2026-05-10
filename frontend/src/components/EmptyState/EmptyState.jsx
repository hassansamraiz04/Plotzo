import "./EmptyState.scss";

function EmptyState({ title, subtitle }) {
  return (
    <div className="emptyState">
      <h3>{title}</h3>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

export default EmptyState;
