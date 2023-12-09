import "../Styles/Auth.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Login = () => {
  const [guidelineAccepeted, setGuidelineAccpeted] = useState(false);
  const { t } = useTranslation();

  const HandleLogin = (e: any) => {
    e.preventDefault();

    if (!guidelineAccepeted) {
      return;
    }
    window.location.href =
      "https://discord.com/api/oauth2/authorize?client_id=1137736225575411802&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord&response_type=token&scope=identify";
  };

  return (
    <div className="auth-container">
      <form onSubmit={HandleLogin}>
        <div className="auth-discord-signup">
          <button type="submit">{t("login.signin-with-discord")}</button>
        </div>
        <div className="auth-signup-warning">
          <label>
            <input
              required
              onChange={(e) => {
                setGuidelineAccpeted(e.target.checked);
              }}
              checked={guidelineAccepeted}
              type="checkbox"
              name="guideline-accepted"
            />
            {t('login.age-verification')}
          </label>
        </div>
      </form>
    </div>
  );
};
