import { useState } from "react";
import Spinner from "./Spinner";
import { API_BASE } from "./App";


const withMinDelay = (promise, ms) =>
  Promise.all([promise, new Promise((resolve) => setTimeout(resolve, ms))]).then(
    ([result]) => result
  );

const ContactForm = ({ existingContact = {}, updateCallback, onCancel }) => {
  const [firstName, setFirstName] = useState(existingContact.firstName || "");
  const [lastName, setLastName] = useState(existingContact.lastName || "");
  const [email, setEmail] = useState(existingContact.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updating = Object.entries(existingContact).length !== 0;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const data = { firstName, lastName, email };
    const url = `${API_BASE}/` + (updating ? `update_contact/${existingContact.id}` : "create_contact");
    const options = {
      method: updating ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    try {
      const response = await withMinDelay(fetch(url, options), 600);
      if (response.status !== 201 && response.status !== 200) {
        const body = await response.json();
        alert(body.message);
        setIsSubmitting(false);
      } else {
        updateCallback();
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="firstName">First name</label>
        <input
          type="text"
          id="firstName"
          placeholder="Ada"
          value={firstName}
          disabled={isSubmitting}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="lastName">Last name</label>
        <input
          type="text"
          id="lastName"
          placeholder="Lovelace"
          value={lastName}
          disabled={isSubmitting}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          placeholder="ada@example.com"
          value={email}
          disabled={isSubmitting}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <Spinner size="sm" /> : updating ? "Save changes" : "Create contact"}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;