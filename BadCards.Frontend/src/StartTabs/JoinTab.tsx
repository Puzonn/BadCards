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
    <div className="tab-box text-center">
      <Container>
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
                <div className="d-flex">
                  <FormControl
                    style={{ height: "40px" }}
                    maxLength={15}
                    className="w-75"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    type="password"
                    placeholder="Lobby Password"
                  />
                  <Button
                    variant="light"
                    className="text-center text-black border-0"
                    style={{
                      marginLeft: "10px",
                      fontWeight: 600,
                      height: "40px",
                    }}
                    type="submit"
                  >
                    Join Game
                  </Button>
                  <Button style={{marginLeft: "10px"}} className="border-0">Join Random Game</Button>
                </div>
              </FormGroup>
            </Form>
          </div>
        )}
        {error && <span>{error}</span>}
      </Container>
    </div>
  );
};
