import { useEffect } from "react";

export const Auth = () => {
  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));

    const auth = [
      fragment.get("access_token"),
      fragment.get("token_type"),
      fragment.get("expires_in"),
    ];

    if (typeof auth === "undefined") {
      window.location.href = "/";
      return;
    }

    const authJson = {
      Access_token: auth[0],
      Token_type: auth[1],
      Expires_in: auth[2],
    };

    fetch(`${process.env.REACT_APP_API_URL}/auth/discord`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authJson),
    }).then(() => {
      window.location.href = "/dashboard";
    });
  }, []);
  return <></>;
};
