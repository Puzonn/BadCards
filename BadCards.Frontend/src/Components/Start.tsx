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
import { CreateTab } from "../StartTabs/CreateTab";
import { JoinTab } from "../StartTabs/JoinTab";

export const Start = () => {
  const [error, setError] = useState("");
  const [inputFields, setInputFields] = useState({
    lobbyCode: "",
    password: "",
  });

  useEffect(() => {
    axios.defaults.withCredentials = true;
    (async function () {
      await axios.get(`${Config.default.ApiUrl}/user/game-pending-status`, {headers: {
        'Content-Type': 'application/json'
      }}  ).catch(() => {})
    })();
  }, [])

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
          setError("Lobby dose not exist, or password is incorrect.");
        });
    })();
  };

  const HandleCreate = async (password: string) => {
    try {
      await axios
        .post(
          `${Config.default.ApiUrl}/game/create`,
          JSON.stringify(password),
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
    <div className="d-flex align-items-center text-white justify-content-center">
      <div id="start-tabs">
        <div
          style={{
            fontWeight: "600",
            marginTop: "40px",
            paddingBottom: "8px",
            width: "65vw",
          }}
        >
          <Tabs defaultActiveKey="join" className="mb-2 w-100 start-tabs" fill>
            <Tab
              eventKey="create"
              title={
                <div className="d-flex justify-content-center">
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
                  <span>Create Game</span>
                </div>
              }
            >
              <CreateTab onSubmit={HandleCreate}></CreateTab>
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
                  <span>Join Game</span>
                </div>
              }
            >
              <JoinTab error={error} onSubmit={HandleJoin}></JoinTab>
            </Tab>
            <Tab
              eventKey="about"
              title={
                <div>
                  <span>About</span>
                </div>
              }
            >
              <div className="custom-box text-white">
                <span>todo</span>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
