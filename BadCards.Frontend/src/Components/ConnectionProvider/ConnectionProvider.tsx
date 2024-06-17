import { useEffect, useState } from "react";
import { ConnectionContext } from "../../Context/ConnectionContext";
import { IProps } from "../Auth/AuthProvider";
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";

export const ConnectionProvider = ({ children }: IProps) => {
  const [Connection, setConnection] = useState<HubConnection>();

  const Build = (url: string) => {
    const connection = new HubConnectionBuilder()
      .withUrl(url, {
        withCredentials: true,
        timeout: 60 * 3600 * 60 * 3600,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Critical)
      .build();
    setConnection(connection);
  };

  const RegisterHandler = (
    handlerName: string,
    callback: (...args: any[]) => any
  ) => {
    Connection?.on(handlerName, callback);
  };

  const Send = (methodName: string, data: any) => {
    Connection?.send(methodName, data);
  };

  return (
    <ConnectionContext.Provider
      value={{
        RegisterHandler: RegisterHandler,
        Send: Send,
        Connection: Connection,
        Build: Build,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
