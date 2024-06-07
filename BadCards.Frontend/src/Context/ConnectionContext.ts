import { createContext } from "react";
import { HubConnection } from "@microsoft/signalr";

export const ConnectionContext = createContext<ConnectionProps>({
  Connection: undefined,
  Build: (url: string) => {},
  Send: (methodName: string, data: any) => {},
  RegisterHandler: (
    methodName: string,
    callback: (...args: any[]) => void
  ) => {},
});

export type ConnectionProps = {
  Connection: HubConnection | undefined;
  Build: (url: string) => void;
  Send: (methodName: string, data: any) => void;
  RegisterHandler: (
    handlerName: string,
    callback: (...args: any[]) => void
  ) => void;
};
