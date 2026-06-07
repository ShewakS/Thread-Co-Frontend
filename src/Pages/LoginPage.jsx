import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useStore, validators } from '../Components/StoreContext';
import loginImage from '../Assets/Images/login page.jpg';

const LoginPage = () => {
  const { login, loginState } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  const [form, setForm] = useState({ email: loginState.lastEmail || '', password: '' });
  const [notice, setNotice] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setNotice(null);
    if (!validators.isValidEmail(form.email))
      return setNotice({ type: 'error', text: 'Enter a valid email address.' });
    if (!form.password)
      return setNotice({ type: 'error', text: 'Password is required.' });

    const result = await login(form);
    setNotice({ type: result.ok ? 'success' : 'error', text: result.message });
    if (result.ok) {
      window.setTimeout(() => navigate(result.isAdmin ? '/admin/dashboard' : redirectTo), 900);
    }
  };

  return (
    <div className="auth-page login-auth-page">
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <div className="auth-logo">THREAD & CO</div>
          <h2 className="auth-title">Login</h2>
          <p className="auth-subtitle">Enter your email address and password to access your account.</p>

          <form className="auth-form-grid" onSubmit={onSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label">Email Address <span className="auth-required">*</span></label>
              <TextField
                fullWidth
                placeholder="Enter Email Address"
                type="email"
                value={form.email}
                size="small"
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label className="auth-label">Password <span className="auth-required">*</span></label>
                <Link to="/forgot-password" className="auth-forgot">Forgot Password?</Link>
              </div>
              <TextField
                fullWidth
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                size="small"
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword((p) => !p)} edge="end">
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </div>

            {notice && <Alert severity={notice.type}>{notice.text}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="auth-submit"
            >
              Login Now
            </Button>

            <p className="auth-switch-text">
              If You Don't Have An Account Please,{' '}
              <Link to="/signup" className="auth-switch-link">Sign Up Now</Link>
            </p>
          </form>
        </div>
      </div>

      <div className="auth-image-panel">
        <img src={loginImage} alt="THREAD & CO" />
      </div>
    </div>
  );
};

export default LoginPage;
