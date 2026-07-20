import { useState } from "react";
import Spinner from "./Spinner";
import { API_BASE } from "./App";

// const API_BASE = "http://127.0.0.1:5000";

const initials = (first, last) =>
  `${(first || "?").charAt(0)}${(last || "").charAt(0)}`.toUpperCase();

const ContactList = ({ contacts, updateContact, updateCallback }) => {
  const [deletingId, setDeletingId] = useState(null);

  const onDelete = async (id) => {
    setDeletingId(id);
    try {
      const response = await fetch(`${API_BASE}/delete_contact/${id}`, { method: "DELETE" });
      if (response.status === 200) {
        updateCallback();
      } else {
        console.error("Failed to delete");
        setDeletingId(null);
      }
    } catch (error) {
      alert(error);
      setDeletingId(null);
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">No contacts yet</p>
        <p>Add your first contact to see it appear here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-header">
        <h2>
          All contacts
          <span className="table-count">{contacts.length}</span>
        </h2>
      </div>
      <div className="table-scroll">
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Last name</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td className="name-cell">
                  <div className="name-flex">
                    <span className="avatar-badge">{initials(contact.firstName, contact.lastName)}</span>
                    {contact.firstName}
                  </div>
                </td>
                <td>{contact.lastName}</td>
                <td className="email-cell">{contact.email}</td>
                <td>
                  <div className="actions-cell">
                    {deletingId === contact.id ? (
                      <Spinner size="sm" />
                    ) : (
                      <>
                        <button className="btn btn-ghost btn-sm" onClick={() => updateContact(contact)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => onDelete(contact.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ContactList;