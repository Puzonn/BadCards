import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useState, useEffect } from "react";

const useConnection = (url:string, onstart?: () => void) => {
  const [connection, setConnection] = useState<HubConnection>(new HubConnectionBuilder()
  .withUrl(url, {
    withCredentials: true,
    timeout: 60 * 3600 * 60 * 3600,
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets,
  })
  .configureLogging(LogLevel.Debug)
  .build());

  useEffect(() => {
    connection.start().then(() => {onstart?.()})
  }, [url]);

  return connection;
};

export default useConnection;