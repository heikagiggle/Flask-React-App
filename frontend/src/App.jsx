import { useState, useEffect } from "react";
import ContactList from "./ContactList";
import ContactForm from "./ContactForm";
import Spinner from "./Spinner";
import "./App.css";

export const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

// Ensures fast responses still show the loading state briefly,
// so the UI never feels like it "jumped" — same rule used for
// the splash screen and the table refresh.
const withMinDelay = (promise, ms) =>
  Promise.all([promise, new Promise((resolve) => setTimeout(resolve, ms))]).then(
    ([result]) => result
  );

function App() {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({});
  const [isBooting, setIsBooting] = useState(true);
  const [splashLeaving, setSplashLeaving] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  useEffect(() => {
    const boot = async () => {
      await withMinDelay(fetchContacts(), 1300);
      setSplashLeaving(true);
      setTimeout(() => setIsBooting(false), 500); // matches CSS fade duration
    };
    boot();
  }, []);

  const fetchContacts = async () => {
    const response = await fetch(`${API_BASE}/contacts`);
    const data = await response.json();
    setContacts(data.contacts || []);
    return data;
  };

  const refreshContacts = async () => {
    setIsTableLoading(true);
    await withMinDelay(fetchContacts(), 700);
    setIsTableLoading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentContact({});
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openEditModal = (contact) => {
    if (isModalOpen) return;
    setCurrentContact(contact);
    setIsModalOpen(true);
  };

  const onUpdate = () => {
    closeModal();
    refreshContacts();
  };

  if (isBooting) {
    return (
      <div className={`splash${splashLeaving ? " leaving" : ""}`}>
        <div className="splash-orb-wrap">
          <span className="pulse-spinner size-lg">
            <span className="ring" />
            <span className="ring" />
          </span>
          <div className="splash-orb-core" style={{ position: "absolute" }} />
        </div>
        <p className="splash-title">Contacts</p>
        <p className="splash-text">Please wait, setting things up…</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">Address book</p>
          <h1 className="app-title">Your Contacts</h1>
          <p className="app-subtitle">
            {contacts.length} {contacts.length === 1 ? "person" : "people"} saved
          </p>
        </div>
      </header>

      <div className="card">
        {isTableLoading && (
          <div className="table-overlay">
            <Spinner size="lg" />
            <span className="table-overlay-text">Refreshing contacts…</span>
          </div>
        )}
        <div className="table-body-wrap">
          <ContactList contacts={contacts} updateContact={openEditModal} updateCallback={onUpdate} />
        </div>
      </div>

      <div className="new-contact-row">
        <button className="btn btn-primary" onClick={openCreateModal}>
          + New Contact
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Close">
              &times;
            </button>
            <h2 className="modal-title">
              {Object.keys(currentContact).length ? "Edit Contact" : "New Contact"}
            </h2>
            <p className="modal-subtitle">
              {Object.keys(currentContact).length
                ? "Update the details below."
                : "Add someone new to your address book."}
            </p>
            <ContactForm existingContact={currentContact} updateCallback={onUpdate} onCancel={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;