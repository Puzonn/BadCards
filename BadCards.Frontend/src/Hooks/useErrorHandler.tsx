import { useState, useEffect } from "react";
import { ErrorHandler, MultipleErrorHandler } from "../Types/Error";

const useErrorHandler = () => {
  const SetError = (destination: string, text: string) => {
    const error: ErrorHandler = { Destination: destination, Text: text };
    setErrorHandler((prev) => {
      const newErrors = [...prev.Errors, error];

      return { ...prev, Errors: newErrors };
    });
  };

  const GetError = (destination: string) => {
    const r = (errorHandler.Errors as ErrorHandler[]).find(
      (x) => x.Destination === destination
    ) as ErrorHandler;

    if (r) {
      return r.Text;
    }

    return "";
  };

  const HasError = (destination: string) => {
    const r = (errorHandler.Errors.find(
      (x) => x.Destination === destination
    ) !== undefined) as boolean;
    return r;
  };

  const [errorHandler, setErrorHandler] = useState<MultipleErrorHandler>({
    Errors: [],
    HasError: HasError,
    SetError: (destination, text) => SetError(destination, text),
    GetError: GetError,
  });

  return { errorHandler, SetError, HasError, GetError };
};

export default useErrorHandler;
