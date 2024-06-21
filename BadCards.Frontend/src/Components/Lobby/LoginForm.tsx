import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Config } from "../../Config";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

export const LoginForm = () => {
  const auth = useContext(AuthContext);

  const HandleDiscordLogin = () => {
    window.location.href = Config.default.OAuth2;
  };

  const HandleGuestLogin = async () => {
    await axios
      .post(`${Config.default.ApiUrl}/auth/guest`)
      .then((response) => {
        if (response.status === 200) {
          window.location.reload();
        }
      })
      .catch(() => {});
  };

  return (
    <Container>
      <Row className="justify-content-center text-white text-center">
        <Col md={10}>
          <Button
            onClick={HandleDiscordLogin}
            style={{ backgroundColor: "#6a86da", fontWeight: "600" }}
            className="border-0 m-3 login-form_button login-form_animation"
          >
            Sign in with Discord
          </Button>
          <br></br>
          <Button
            onClick={HandleGuestLogin}
            style={{ fontWeight: "600" }}
            className="border-0 m-2 login-form_animation"
          >
            Continue as Guest
          </Button>
          <br></br>
          <span>
            By Proceeding, you are agreeing to our terms of service and that you
            have read our privacy policy found
          </span>
        </Col>
      </Row>
    </Container>
  );
};
