import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useStore, validators } from '../Components/StoreContext';

const ContactPage = () => {
  const { submitContactMessage } = useStore();
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [notice, setNotice] = useState(null);

  const onChange = (field) => (event) => {
    const next = { ...form, [field]: event.target.value };
    setForm(next);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setNotice(null);

    if (!validators.isValidName(form.name)) return setNotice({ type: 'error', text: 'Enter a valid name.' });
    if (!validators.isValidEmail(form.email)) return setNotice({ type: 'error', text: 'Enter a valid email address.' });
    if (!validators.isValidSubject(form.subject)) return setNotice({ type: 'error', text: 'Enter a valid subject.' });
    if (form.message.trim().length < 10) return setNotice({ type: 'error', text: 'Message should be at least 10 characters long.' });

    const result = await submitContactMessage(form);
    setNotice({ type: result.ok ? 'success' : 'error', text: result.ok ? 'Message saved successfully. Our team will contact you soon.' : result.message });
    if (result.ok) setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="section section-alt">
      <section className="container">
        <header className="page-heading">
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle">We are here to help with orders, products, and support.</p>
        </header>

        <div className="contact-grid">
          <article className="content-block">
            <h3>Send us a message</h3>
            <form className="form-grid" onSubmit={onSubmit} noValidate>
              <TextField label="Name" value={form.name} onChange={onChange('name')} />
              <TextField label="Email" value={form.email} onChange={onChange('email')} type="email" />
              <TextField label="Subject" value={form.subject} onChange={onChange('subject')} />
              <TextField
                label="Message"
                value={form.message}
                onChange={onChange('message')}
                multiline
                minRows={4}
              />
              <Button type="submit" color="secondary" variant="contained" className="btn">Submit</Button>
              {notice ? <Alert severity={notice.type}>{notice.text}</Alert> : null}
            </form>
          </article>

          <article className="content-block contact-meta">
            <h3>Contact Details</h3>
            <p><strong>Email:</strong> care@threadco.com</p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
            <p><strong>Address:</strong> 42 Style Avenue, Bengaluru, India</p>
            <p><strong>Business Hours:</strong> Mon-Sat, 10:00 AM - 7:00 PM</p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
