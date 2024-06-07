import {
  Col,
  Container,
  FormGroup,
  Row,
  Form,
  FormLabel,
  FormControl,
  Button,
} from "react-bootstrap";
import { LoginForm } from "../LoginForm";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";

export const JoinTab = ({
  onSubmit,
  error,
}: {
  onSubmit: (lobbyCode: string, password: string) => {};
  error: string;
}) => {
  const auth = useContext(AuthContext);
  const [password, setPassword] = useState<string>("");
  const [lobbyCode, setLobbyCode] = useState<string>("");

  const preSubmit = (event: FormEvent) => {
    event.preventDefault();

    onSubmit(lobbyCode, password);
  };

  return (
      <Container className="tab-box">
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={10}>
            {auth.IsFetched && auth.IsLoggedIn && (
              <div className="text-start m-2">
                <Form onSubmit={preSubmit}>
                  <FormGroup controlId="join-lobby_code">
                    <FormLabel>Lobby Code</FormLabel>
                    <FormControl
                      style={{ color: "white" }}
                      maxLength={10}
                      onChange={(e) => setLobbyCode(e.target.value)}
                      required
                      type="text"
                      placeholder="Enter Lobby Code"
                    />
                  </FormGroup>
                  <FormGroup style={{marginTop: "10px"}} controlId="join-lobby_password">
                    <FormLabel>Lobby Password</FormLabel>
                    <FormControl
                      style={{ height: "40px" }}
                      maxLength={15}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="Lobby Password"
                    />
                  </FormGroup>
                  <div style={{ marginTop: "15px" }} className="d-grid gap-2">
                    <Button
                      style={{ fontWeight: 600 }}
                      variant="light"
                      className="text-center text-black"
                      type="submit"
                    >
                      Join Game
                    </Button>
                    <Button
                      style={{ fontWeight: 600 }}
                      className="text-center"
                      type="button"
                    >
                      Join Random Game
                    </Button>
                  </div>
                </Form>
              </div>
            )}
            {error && <span>{error}</span>}
          </Col>
        </Row>
      </Container>
  );
};
