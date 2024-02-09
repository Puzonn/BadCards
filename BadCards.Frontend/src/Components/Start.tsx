import "./Styles/Start.css";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { Room } from "../Types/LobbyManagerTypes";
import { Config } from "../Config";
import { Button, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { LoginForm } from "./LoginForm";

export const Start = () => {
  const [error, setError] = useState("");
  const auth = useContext(AuthContext);
  const { t } = useTranslation();
  const [inputFields, setInputFields] = useState({
    lobbyCode: "",
    password: "",
  });

  const HandleJoin = async (
    lobbyCode: string | undefined,
    password: string | undefined
  ) => {
    const data = {
      LobbyCode: lobbyCode,
      Password: password,
    };

    (async function () {
      axios
        .post(`${Config.default.ApiUrl}/game/join`, JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status !== 200) {
            return;
          }
          const room = response.data as Room;
          window.location.href = `/lobby?code=${room.LobbyCode}`;
        })
        .catch((err) => {
          setError("Lobby dose not exist, or password is incorrect");
        });
    })();
  };

  const HandleJoinClick = async (event: FormEvent) => {
    event.preventDefault();

    HandleJoin(inputFields.lobbyCode, inputFields.password);
  };

  const HandleCreateClick = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await axios
        .post(
          `${Config.default.ApiUrl}/game/create`,
          JSON.stringify(inputFields.password),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const response = res.data as Room;
          HandleJoin(response.LobbyCode, undefined);
        });
    } catch (x) {}
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <div id="start-tabs">
        <div
          className="text-center text-white"
          style={{
            fontWeight: "600",
            marginTop: "40px",
            paddingBottom: "8px",
            backgroundColor: "var(--bs-secondary)",
            borderRadius: "10px",
            width: "70vw",
          }}
        >
          <Tabs defaultActiveKey="join" className="mb-2 w-100 start-tabs" fill>
            <Tab
              disabled={auth.User?.Role === "Guest"}
              eventKey="create"
              title={
                <div className="d-flex justify-content-center ">
                  <svg
                    style={{ width: "15px", marginRight: "6px" }}
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    aria-hidden="true"
                    className="svg-inline--fa fa-plus fa-w-14"
                  >
                    <path
                      d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  Create Game
                </div>
              }
            >
              <LoginForm></LoginForm>
              {auth.IsFetched && auth.IsLoggedIn && (
                <div className="text-start m-3">
                  <Form onSubmit={HandleCreateClick}>
                    <Form.Group controlId="create-lobby_password">
                      <Form.Label>Lobby Password</Form.Label>
                      <Form.Control
                        className="w-75"
                        maxLength={15}
                        onChange={(e) => {
                          setInputFields({
                            ...inputFields,
                            password: e.target.value,
                          });
                        }}
                        type="password"
                        placeholder="Lobby Password"
                      />
                    </Form.Group>
                    <Button
                      className="text-center border-0"
                      style={{ marginTop: "15px" }}
                      type="submit"
                    >
                      Create Game
                    </Button>
                  </Form>
                </div>
              )}
            </Tab>
            <Tab
              eventKey="join"
              title={
                <div className="d-flex justify-content-center ">
                  <svg
                    role="img"
                    style={{ width: "15px", marginRight: "6px" }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    aria-hidden="true"
                    className="svg-inline--fa fa-arrow-right-to-bracket fa-w-16"
                  >
                    <path
                      d="M416 32h-64c-17.67 0-32 14.33-32 32s14.33 32 32 32h64c17.67 0 32 14.33 32 32v256c0 17.67-14.33 32-32 32h-64c-17.67 0-32 14.33-32 32s14.33 32 32 32h64c53.02 0 96-42.98 96-96V128C512 74.98 469 32 416 32zM342.6 233.4l-128-128c-12.51-12.51-32.76-12.49-45.25 0c-12.5 12.5-12.5 32.75 0 45.25L242.8 224H32C14.31 224 0 238.3 0 256s14.31 32 32 32h210.8l-73.38 73.38c-12.5 12.5-12.5 32.75 0 45.25s32.75 12.5 45.25 0l128-128C355.1 266.1 355.1 245.9 342.6 233.4z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  Join Game
                </div>
              }
            >
              <LoginForm></LoginForm>
              <Container>
                <Row>
                  <Col md="9" xs="12" lg="8">
                    {auth.IsFetched && auth.IsLoggedIn && (
                      <div className=" text-start m-2">
                        <Form onSubmit={HandleJoinClick}>
                          <Form.Group
                            className="mb-3"
                            controlId="join-lobby_code"
                          >
                            <Form.Label>* Lobby Code</Form.Label>
                            <Form.Control
                              style={{
                                backgroundColor: "#212529",
                                color: "white",
                              }}
                              maxLength={10}
                              className="w-75"
                              onChange={(e) => {
                                setInputFields({
                                  ...inputFields,
                                  lobbyCode: e.target.value,
                                });
                              }}
                              required
                              type="text"
                              placeholder="Enter Lobby Code"
                            />
                          </Form.Group>
                          <Form.Group controlId="join-lobby_password">
                            <Form.Label>Lobby Password</Form.Label>
                            <Form.Control
                              maxLength={15}
                              className="w-75"
                              onChange={(e) => {
                                setInputFields({
                                  ...inputFields,
                                  password: e.target.value,
                                });
                              }}
                              type="password"
                              placeholder="Lobby Password"
                            />
                          </Form.Group>
                          <Button
                            className="text-center border-0"
                            style={{ marginTop: "15px" }}
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
              </Container>
            </Tab>
            <Tab eventKey="about" title="About">
              todo
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
