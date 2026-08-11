export default function MessageDialog({ message, title = "Cart Updated", onClose }) {
  if (!message) {
    return null;
  }

  const isCartUpdate = title === "Cart Updated";

  return (
    <div className="modal-backdrop" role="presentation">
      <article
        className="modal-card message-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="message-dialog-title"
      >
        <button type="button" className="message-dialog-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5Z" />
          </svg>
        </button>

        <div className="message-confetti" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="message-dialog-icon" aria-hidden="true">
          <svg viewBox="0 0 64 64" focusable="false">
            <path d="M15.4 14h-5.2v5h8.7l6.7 24.2h21.2l5.6-19.8H24.8L23 17.1A4.2 4.2 0 0 0 18.9 14h-3.5Zm11 34.5a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6Zm20.2 0a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6Z" />
            <circle cx="45.8" cy="20.2" r="11.2" />
            <path className="message-dialog-check" d="m40.1 20.2 3.8 3.8 7.4-8" />
          </svg>
        </div>
        <h2 id="message-dialog-title">
          {isCartUpdate ? (
            <>
              Cart <span>Updated!</span>
            </>
          ) : (
            title
          )}
        </h2>
        <p data-cy="message-dialog-text">{message}</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onClose}
          autoFocus
          data-cy="message-dialog-ok"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m9.3 16.9-4.2-4.2 1.4-1.4 2.8 2.8 7.8-7.8 1.4 1.4-9.2 9.2Z" />
          </svg>
          {isCartUpdate ? "OK, Continue Shopping" : "OK"}
        </button>
      </article>
    </div>
  );
}
