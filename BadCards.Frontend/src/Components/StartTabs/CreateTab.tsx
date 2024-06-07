import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";

export const CreateTab = ({
  onSubmit,
}: {
  onSubmit: (password: string) => {};
}) => {
  const auth = useContext(AuthContext);
  const [password, setPassword] = useState<string>("");

  const preSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(password);
  };

  if (auth.User?.role === "Guest") {
    return (
      <div className="tab-box text-xl-center">
        <span>You have to be atleast Discord User to create lobby </span>
      </div>
    );
  }

  return (
    <Container className="tab-box">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={10}>
          {auth.IsFetched && auth.IsLoggedIn && (
            <div className="text-start m-3">
              <Form onSubmit={preSubmit}>
                <FormGroup controlId="create-lobby_password">
                  <FormLabel>Lobby Password</FormLabel>
                  <FormControl
                    style={{
                      height: "40px",
                      width: "100%", // Adjusted width to 100%
                    }}
                    maxLength={15}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    type="password"
                    placeholder="Lobby Password"
                  />
                  <div style={{ marginTop: "15px" }}>
                    <Button
                      className="text-black"
                      variant="light"
                      style={{
                        fontWeight: 600,
                        height: "40px",
                        width: "100%", // Adjusted width to 100%
                      }}
                      type="submit"
                    >
                      Create Game
                    </Button>
                  </div>
                </FormGroup>
              </Form>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};
