import { useEffect, useState } from "react";

export const BrowserAICreator = () => {
  const [invalidVersion, setInvalidVersion] = useState(false);

  useEffect(() => {
    const session = (window as any).ai;
    if (session === undefined || session === null) {
      setInvalidVersion(true);
    }
  });

  if (invalidVersion) {
    return (
      <div className="flex flex-col items-center gap-2 font-medium justify-center">
        <div className="bg-white rounded mt-10 p-4">
          <span className="text-black">
            Your browser is not supported. Please update Chrome to version 127
            or higher.
          </span>
          <p>
            <a
              className="hover:underline text-blue-500"
              href="https://ai-sdk-chrome-ai.vercel.app/"
            >
              See more
            </a>
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => (window.location.href = "/creator")}
              className="rounded-lg bg-black text-white py-2 px-10 text-center align-middle text-1xl hover:scale-105 
                font-bold shadow-md transition-all"
            >
              Get me back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};
