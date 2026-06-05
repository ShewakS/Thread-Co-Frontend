import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useStore, validators } from '../Components/StoreContext';

const ForgotPasswordPage = () => {
  const { resetState, setResetState } = useStore();
  const [email, setEmail] = useState(resetState.email || '');
  const [notice, setNotice] = useState(null);

  const onSubmit = (event) => {
    event.preventDefault();
    setNotice(null);
    if (!validators.isValidEmail(email)) return setNotice({ type: 'error', text: 'Enter a valid email address.' });
    setResetState({ email, requestedAt: Date.now() });
    setNotice({ type: 'success', text: 'Password reset link sent.' });
    setEmail('');
  };

  return (
    <main className="section section-alt">
      <section className="container">
        <div className="form-wrap">
          <h1 className="form-title">Forgot Password</h1>
          <p className="form-subtitle">Enter your registered email to receive a reset link.</p>
          <form className="form-grid" onSubmit={onSubmit} noValidate>
            <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
            <Button color="secondary" variant="contained" className="btn btn-block" type="submit">
              Send Reset Link
            </Button>
            <p>
              Remembered your password? <Link to="/login" className="helper-link">Back to Login</Link>
            </p>
            {notice ? <Alert severity={notice.type}>{notice.text}</Alert> : null}
          </form>
        </div>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
