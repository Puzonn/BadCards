import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Form,
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
    <div className="tab-box text-center">
      {auth.IsFetched && auth.IsLoggedIn && (
        <>
          <div className="text-start m-3">
            <Form onSubmit={preSubmit}>
              <FormGroup controlId="create-lobby_password">
                <FormLabel>Lobby Password</FormLabel>
                <div className="d-flex">
                  <FormControl
                    style={{
                      height: "40px",
                      width: "88%"
                    }}
                    maxLength={15}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    type="password"
                    placeholder="Lobby Password"
                  />
                  <Button
                    className="text-black"
                    variant="light"
                    style={{ fontWeight: 600, marginLeft: '10px', height: "40px" }}
                    type="submit"
                  >
                    Create Game
                  </Button>
                </div>
              </FormGroup>
            </Form>
          </div>
        </>
      )}
    </div>
  );
};
