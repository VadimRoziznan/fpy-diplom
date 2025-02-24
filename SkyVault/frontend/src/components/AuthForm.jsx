import React from "react";

const AuthForm = ({
  formData,
  handleChange,
  handleSubmit,
  passwordError,
  loginError,
  togglePasswordVisibility,
  showPassword,
  isLogin,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Логин
        </label>
        <input
          type="text"
          className="form-control"
          id="username"
          name="username"
          value={formData.username}
          placeholder="Введите логин"
          onChange={handleChange}
          required
        />
      </div>
      {loginError && <div className="text-danger mb-3">{loginError}</div>}
      {formData.first_name !== undefined && (
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            Имя пользователя
          </label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            placeholder="Введите имя пользователя"
            onChange={handleChange}
            required
          />
        </div>
      )}
      {formData.email !== undefined && (
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            placeholder="Введите email"
            onChange={handleChange}
            required
          />
        </div>
      )}
      <div className="mb-3 position-relative">
        <label htmlFor="password" className="form-label">
          Пароль
        </label>
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          id="password"
          name="password"
          value={formData.password}
          placeholder="Введите пароль"
          onChange={handleChange}
          required
        />
        <span
          onClick={togglePasswordVisibility}
          style={{
            position: "absolute",
            top: "55%",
            right: "10px",
            cursor: "pointer",
            color: "#000",
          }}
        >
          {showPassword ? (
            <i className="bi bi-eye"></i>
          ) : (
            <i className="bi bi-eye-slash"></i>
          )}
        </span>
      </div>
      {passwordError && <div className="text-danger mb-3">{passwordError}</div>}
      <button type="submit" name="submit" className="btn btn-primary w-100">
        {isLogin ? "Войти" : "Зарегистрироваться"}
      </button>
    </form>
  );
};

export default AuthForm;
