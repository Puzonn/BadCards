import { useEffect, useState } from "react";
import { BrowserAICreator } from "./BrowserAICreator";
import { AICreator } from "./AICreator";

export const Creator = () => {
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
      <div className="flex flex-col text-white justify-center items-center">
        <div className="bg-white p-3 rounded mt-10">
          <span>Choose mode</span>
          <div className="flex gap-3 text-black">
            <button
              className="rounded-lg bg-black text-white py-2 px-10 text-center align-middle text-1xl hover:scale-105 
                font-bold shadow-md transition-all"
            >
              By Hand
            </button>
            <button
              onClick={() => setCreatorMode("ai")}
              className="rounded-lg bg-orange-100 py-2 border-black border-3 px-10 text-center align-middle text-1xl hover:scale-105 
                font-bold shadow-md transition-all text-black"
            >
              Use AI
            </button>
            <button
              onClick={() => setCreatorMode("browserai")}
              className="rounded-lg bg-blue-200 py-2 px-10  border-black border-3 text-center align-middle text-1xl hover:scale-105 
                font-bold shadow-md transition-all text-black"
            >
              Use browser AI session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};
