import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useStore, validators } from '../Components/StoreContext';
import loginImage from '../Assets/Images/login page.jpg';

const ForgotPasswordPage = () => {
  const { requestPasswordReset } = useStore();
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setNotice(null);
    if (!validators.isValidEmail(email)) return setNotice({ type: 'error', text: 'Enter a valid email address.' });
    setIsSubmitting(true);
    const result = await requestPasswordReset(email);
    setIsSubmitting(false);
    setNotice({ type: result.ok ? 'success' : 'error', text: result.ok ? 'Password reset request saved.' : result.message });
    if (result.ok) setEmail('');
  };

  return (
    <div className="auth-page login-auth-page login-page">
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

            <Button fullWidth variant="contained" className="auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending Request...' : 'Send Reset Link'}
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
