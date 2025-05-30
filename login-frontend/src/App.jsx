import './loginpage.css';

function App() {
  return (
    <div className="container">
      <div className="login-form">
        <form>
          <label htmlFor="email">
            Email<span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="example@orchida-soft.com"
            required
          />

          <label htmlFor="password">
            Password<span className="required">*</span>
          </label>
          <input
            type="password"
            id="password"
            placeholder="@B123"
            required
          />

          <div className="form-options">
            <label className="keep-logged">
              <input type="checkbox" />
              Keep Me Logged in
            </label>
            <a href="#" className="forgot-password">Forgot Your Password?</a>
          </div>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>

      <div className="right-side">
        <img
          src="/imagesbelaantara.png"
          alt="Belantara Foundation Logo"
          className="center-logo"
        />
      </div>
    </div>
  );
}

export default App;
