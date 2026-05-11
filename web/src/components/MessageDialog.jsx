export default function MessageDialog({ message, title = "Cart Updated", onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <article
        className="modal-card message-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="message-dialog-title"
      >
        <h2 id="message-dialog-title">{title}</h2>
        <p>{message}</p>
        <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>
          OK
        </button>
      </article>
    </div>
  );
}
