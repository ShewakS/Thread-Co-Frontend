import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useStore, validators } from '../Components/StoreContext';
import loginImage from '../Assets/Images/login page.jpg';

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
    <div className="auth-page login-auth-page">
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <div className="auth-logo">THREAD & CO</div>
          <h2 className="auth-title">Forgot Password</h2>
          <p className="auth-subtitle">Enter your registered email address and we will send a reset link.</p>

          <form className="auth-form-grid" onSubmit={onSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label">Email Address <span className="auth-required">*</span></label>
              <TextField fullWidth placeholder="Enter Email Address" value={email} onChange={(event) => setEmail(event.target.value)} type="email" size="small" />
            </div>

            {notice ? <Alert severity={notice.type}>{notice.text}</Alert> : null}

            <Button fullWidth variant="contained" className="auth-submit" type="submit">
              Send Reset Link
            </Button>
            <p className="auth-switch-text">
              Remembered your password? <Link to="/login" className="auth-switch-link">Back to Login</Link>
            </p>
          </form>
        </div>
      </div>

      <div className="auth-image-panel">
        <img src={loginImage} alt="THREAD & CO password reset" />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
