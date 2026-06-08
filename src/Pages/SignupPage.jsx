import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useStore, validators } from "../Components/StoreContext";
import loginImage from "../Assets/Images/login page.jpg";

const getPasswordStrength = (password) => {
  const checks = {
    length: password.length >= 6,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  if (!password) return { label: "", value: 0, className: "", checks };
  if (score <= 2) return { label: "Weak", value: 34, className: "weak", checks };
  if (score <= 4) return { label: "Medium", value: 67, className: "medium", checks };
  return { label: "Strong", value: 100, className: "strong", checks };
};

const SignupPage = () => {
  const { signup } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptedPolicies: false,
  });
  const [notice, setNotice] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordStrength = getPasswordStrength(form.password);

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setNotice(null);

    if (!validators.isValidName(form.firstname))
      return setNotice({ type: "error", text: "Enter a valid first name." });
    if (!validators.isValidName(form.lastname))
      return setNotice({ type: "error", text: "Enter a valid last name." });
    if (!validators.isValidEmail(form.email))
      return setNotice({ type: "error", text: "Enter a valid email address." });
    if (!form.phone.trim())
      return setNotice({ type: "error", text: "Enter a valid phone number." });
    if (!validators.isValidPassword(form.password)) {
      return setNotice({
        type: "error",
        text: "Password must be at least 6 characters and include a letter and a number.",
      });
    }
    if (form.password !== form.confirmPassword)
      return setNotice({ type: "error", text: "Passwords do not match." });
    if (!form.acceptedPolicies)
      return setNotice({ type: "error", text: "Please accept the Terms & Conditions and Privacy Policy." });

    setIsSubmitting(true);
    const result = await signup({
      name: `${form.firstname.trim()} ${form.lastname.trim()}`,
      email: form.email,
      phone: form.phone,
      password: form.password,
      acceptedPolicies: form.acceptedPolicies,
    });
    setIsSubmitting(false);

    setNotice({ type: result.ok ? "success" : "error", text: result.message });
    if (result.ok) {
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        acceptedPolicies: false,
      });
      window.setTimeout(() => navigate("/login"), 1000);
    }
  };

  return (
    <div className="auth-page login-auth-page login-page">
      <div className="auth-form-panel">
        <div className="auth-form-inner auth-form-inner-wide">
          <div className="auth-logo">THREAD & CO</div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join THREAD & CO and discover modern essentials curated for everyday wear.</p>

          <form className="auth-form-grid" onSubmit={onSubmit} noValidate>
            <div className="auth-two-col">
              <div className="auth-field">
                <label className="auth-label">First Name <span className="auth-required">*</span></label>
                <TextField fullWidth placeholder="First Name" value={form.firstname} size="small" onChange={onChange("firstname")} />
              </div>
              <div className="auth-field">
                <label className="auth-label">Last Name <span className="auth-required">*</span></label>
                <TextField fullWidth placeholder="Last Name" value={form.lastname} size="small" onChange={onChange("lastname")} />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Email Address <span className="auth-required">*</span></label>
              <TextField fullWidth placeholder="Enter Email Address" value={form.email} onChange={onChange("email")} type="email" size="small" />
            </div>

            <div className="auth-field">
              <label className="auth-label">Phone Number <span className="auth-required">*</span></label>
              <TextField fullWidth placeholder="Phone Number" value={form.phone} onChange={onChange("phone")} size="small" />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password <span className="auth-required">*</span></label>
              <TextField
                fullWidth
                placeholder="Password"
                value={form.password}
                onChange={onChange("password")}
                type={showPassword ? "text" : "password"}
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword((prev) => !prev)} edge="end">
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {form.password ? (
                <div className="password-strength">
                  <div className="password-strength-head">
                    <span>Password strength</span>
                    <strong className={passwordStrength.className}>{passwordStrength.label}</strong>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.value}
                    className={`password-strength-bar ${passwordStrength.className}`}
                  />
                  <ul className="password-requirements">
                    <li className={passwordStrength.checks.length ? "met" : ""}>Minimum 6 characters</li>
                    <li className={passwordStrength.checks.lower ? "met" : ""}>Lowercase letter</li>
                    <li className={passwordStrength.checks.upper ? "met" : ""}>Uppercase letter</li>
                    <li className={passwordStrength.checks.number ? "met" : ""}>Number</li>
                    <li className={passwordStrength.checks.special ? "met" : ""}>Special character</li>
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="auth-field">
              <label className="auth-label">Confirm Password <span className="auth-required">*</span></label>
              <TextField
                fullWidth
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={onChange("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                          {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            {notice ? <Alert severity={notice.type}>{notice.text}</Alert> : null}

            <FormControlLabel
              className="auth-policy-check"
              control={
                <Checkbox
                  checked={form.acceptedPolicies}
                  onChange={(event) => setForm((prev) => ({ ...prev, acceptedPolicies: event.target.checked }))}
                  color="primary"
                  size="small"
                />
              }
              label={
                <span>
                  I agree to the <Link to="/terms" className="auth-switch-link">Terms & Conditions</Link> and <Link to="/privacy" className="auth-switch-link">Privacy Policy</Link>.
                </span>
              }
            />

            <Button type="submit" fullWidth variant="contained" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Sign Up Now'}
            </Button>
            <p className="auth-switch-text">
              Already Have An Account? <Link to="/login" className="auth-switch-link">Login Now</Link>
            </p>
          </form>
        </div>
      </div>

      <div className="auth-image-panel">
        <img src={loginImage} alt="THREAD & CO signup" />
      </div>
    </div>
  );
};

export default SignupPage;
