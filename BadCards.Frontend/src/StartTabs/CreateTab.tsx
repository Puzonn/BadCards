import { FormEvent, useContext, useState } from "react";
import { LoginForm } from "../Components/LoginForm";
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

  if(auth.User?.role === 'Guest'){
    return (
      <div className="tab-box text-xl-center">
        <span>You have to be atleast Discord User to create lobby </span>
      </div>
    )
  }

  return (
    <div className="tab-box text-center">
      <LoginForm></LoginForm>
      {auth.IsFetched && auth.IsLoggedIn && (
        <>
          <div className="text-start m-3">
            <Form onSubmit={preSubmit}>
              <FormGroup controlId="create-lobby_password">
                <FormLabel>Lobby Password</FormLabel>
                <FormControl
                  className="w-75"
                  maxLength={15}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  placeholder="Lobby Password"
                />
              </FormGroup>
              <Button
                className="text-black"
                variant="light"
                style={{ marginTop: "15px", fontWeight: 600 }}
                type="submit"
              >
                Create Game
              </Button>
            </Form>
          </div>
        </>
      )}
    </div>
  );
};
