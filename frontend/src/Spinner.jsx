const Spinner = ({ size = "md" }) => (
  <span className={`pulse-spinner size-${size}`} role="status" aria-label="Loading">
    <span className="ring" />
    <span className="ring" />
  </span>
);

export default Spinner;