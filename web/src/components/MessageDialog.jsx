export default function MessageDialog({ message, onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <article className="modal-card message-dialog" role="alertdialog" aria-modal="true">
        <h2>Cart Updated</h2>
        <p>{message}</p>
        <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>
          OK
        </button>
      </article>
    </div>
  );
}
