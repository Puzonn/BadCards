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
import { LoginForm } from "../Components/LoginForm";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";

export const JoinTab = ({
  onSubmit,
  error
}: {
  onSubmit: (lobbyCode: string, password: string) => {};
  error: string
}) => {
  const auth = useContext(AuthContext);
  const [password, setPassword] = useState<string>("");
  const [lobbyCode, setLobbyCode] = useState<string>("");

  const preSubmit = (event: FormEvent) => {
    event.preventDefault();

    onSubmit(lobbyCode, password)
  }

  return (
    <div className="tab-box text-center">
      <LoginForm></LoginForm>
      <Container>
        <Row>
          <Col md="9" xs="12" lg="8">
            {auth.IsFetched && auth.IsLoggedIn && (
              <div className="text-start m-2">
                <Form onSubmit={preSubmit}>
                  <FormGroup className="mb-3" controlId="join-lobby_code">
                    <FormLabel>Lobby Code</FormLabel>
                    <FormControl
                      style={{
                        color: "white",
                      }}
                      maxLength={10}
                      className="w-75"
                      onChange={(e) => {
                        setLobbyCode(e.target.value);
                      }}
                      required
                      type="text"
                      placeholder="Enter Lobby Code"
                    />
                  </FormGroup>
                  <FormGroup controlId="join-lobby_password">
                    <FormLabel>Lobby Password</FormLabel>
                    <FormControl
                      maxLength={15}
                      className="w-75"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      type="password"
                      placeholder="Lobby Password"
                    />
                  </FormGroup>
                  <Button
                    variant="light"
                    className="text-center text-black border-0"
                    style={{ marginTop: "15px", fontWeight: 600}}
                    type="submit"
                  >
                    Join Game
                  </Button>
                </Form>
              </div>
            )}
          </Col>
          {auth.IsFetched && auth.IsLoggedIn && (
            <Col className="d-flex align-items-center justify-content-center">
              <Button className="border-0">Join Random Game</Button>
            </Col>
          )}
        </Row>
        {error && 
           <span>{error}</span>
        }
      </Container>
    </div>
  );
};
