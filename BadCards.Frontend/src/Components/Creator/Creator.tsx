import { useContext, useEffect, useState } from "react";
import { BrowserAICreator } from "./BrowserAICreator";
import { AICreator } from "./AICreator";
import { AuthContext } from "../../Context/AuthContext";

export const Creator = () => {
  const { User } = useContext(AuthContext);

  const [creatorMode, setCreatorMode] = useState<
    "none" | "byhand" | "ai" | "browserai"
  >("none");

  if (creatorMode === "browserai") {
    return <BrowserAICreator />;
  }

  if (creatorMode === "ai") {
    return <AICreator></AICreator>;
  }

  if (creatorMode === "none") {
    return (
      <div className="flex text-white justify-center h-full items-center">
        <div className="md:max-w-xl w-screen pb-3">
          <div className="bg-white p-3 rounded mt-10">
            <div className="flex gap-3 flex-col text-black">
              <button
                className="rounded-lg bg-black text-white py-2 px-10 text-center align-middle text-1xl hover:scale-105 
                font-bold shadow-md transition-all"
              >
                By Hand
              </button>
              <button
                onClick={() => setCreatorMode("ai")}
                className="rounded-lg bg-orange-100 py-2 border-black border-3 px-10 text-center align-middle text-1xl  hover:scale-105 
                font-bold shadow-md transition-all text-black disabled:bg-opacity-0"
              >
                Use AI
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};
