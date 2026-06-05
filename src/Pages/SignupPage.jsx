import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useStore, validators } from "../Components/StoreContext";

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
  });
  const [notice, setNotice] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const result = await signup({
      name: `${form.firstname.trim()} ${form.lastname.trim()}`,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });

    setNotice({ type: result.ok ? "success" : "error", text: result.message });
    if (result.ok) {
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      window.setTimeout(() => navigate("/login"), 1000);
    }
  };

  return (
    <main className="section section-alt">
      <section className="container">
        <div className="form-wrap">
          <h1 className="form-title">Create Your Account</h1>
          <p className="form-subtitle">
            Join THREAD & CO and discover modern essentials.
          </p>
          <form className="form-grid" onSubmit={onSubmit} noValidate>
            <TextField
              label="First Name"
              value={form.firstname}
              onChange={onChange("firstname")}
            />
            <TextField
              label="Last Name"
              value={form.lastname}
              onChange={onChange("lastname")}
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={onChange("email")}
              type="email"
            />
            <TextField
              label="Phone Number"
              value={form.phone}
              onChange={onChange("phone")}
            />
            <TextField
              label="Password"
              value={form.password}
              onChange={onChange("password")}
              type={showPassword ? "text" : "password"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Confirm Password"
              value={form.confirmPassword}
              onChange={onChange("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              color="secondary"
              variant="contained"
              className="btn btn-block"
              type="submit"
            >
              Signup
            </Button>
            <p>
              Already have an account?{" "}
              <Link to="/login" className="helper-link">
                Login
              </Link>
            </p>
            {notice ? (
              <Alert severity={notice.type}>{notice.text}</Alert>
            ) : null}
          </form>
        </div>
      </section>
    </main>
  );
};

export default SignupPage;
