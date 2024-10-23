import { FormEvent, useEffect, useMemo, useState } from "react";
import Api from "../../Api";
import { Prompt } from "../../Types/Creator";

export const GeneratedPrompt = ({
  GeneratedPrompt,
  DiscardPrompt,
}: {
  DiscardPrompt: () => void;
  GeneratedPrompt: Prompt | Prompt[];
}) => {
  const [currentPrompt, setCurrentPrompt] = useState<Prompt>(GetFirstPrompt());
  const IsBatch = useMemo(
    () => Array.isArray(GeneratedPrompt),
    [GeneratedPrompt]
  );

  function GetFirstPrompt() {
    if (Array.isArray(GeneratedPrompt)) {
      return GeneratedPrompt[0];
    }
    return GeneratedPrompt;
  }

  const GetCurrentPromptIndex = () => {
    return IsBatch ? (GeneratedPrompt as Prompt[]).indexOf(currentPrompt) : 0;
  };

  const IsCurrentPromptLast = () => {
    return IsBatch
      ? GetCurrentPromptIndex() === (GeneratedPrompt as Prompt[]).length - 1
      : true;
  };

  const AcceptPrompt = async (e: FormEvent) => {
    e.preventDefault();
    
    await Api.put("/creator/accept", currentPrompt)
      .then((response) => {
        if (IsCurrentPromptLast()) {
          DiscardPrompt();
        } else {
          setCurrentPrompt(
            (GeneratedPrompt as Prompt[])[GetCurrentPromptIndex() + 1]
          );
        }
      })
      .catch(() => {
        console.error("Error while accepting prompt");
      });
  };

  return (
    <form
      onSubmit={async (e) => await AcceptPrompt(e)}
      className="flex flex-col overflow-x-hidden w-screen mt-10 items-center"
    >
      <div className="md:max-w-5xl w-screen pb-3">
        <div className="bg-white bg-opacity-20 px-3 pb-1 rounded">
          <div className="mb-6 flex justify-center text-white">
            <div className="opacity-100 w-full duration-150 ease-linear">
              <div className="relative w-full text-black">
                <div className="flex flex-col flex-wrap justify-center">
                  <div className="flex flex-col flex-wrap items-center sm:flex-row sm:items-start">
                    <div className="mt-4 pb-4 font-medium flex flex-wrap gap-3">
                      <span className="bg-black text-white p-2 rounded">
                        Tokens Used: {currentPrompt.TokensUsed}
                      </span>
                      <span className="bg-black text-white p-2 rounded">
                        Answer Count: {currentPrompt.AnswerCount}
                      </span>
                      <span className="bg-black text-white p-2 rounded">
                        Translated: PL/US
                      </span>
                      {IsBatch && (
                        <span className="ml-auto bg-black text-white p-2 rounded">
                          {GetCurrentPromptIndex() + 1} /{" "}
                          {(GeneratedPrompt as Prompt[]).length}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold py-1">Generated Question: </span>
                  <div className="font-medium relative justify-start w-full bg-black text-white p-3 rounded">
                    {currentPrompt.Question}
                  </div>
                  <span className="font-bold py-1">Generated Answers: </span>
                  {currentPrompt.Answers.map((answer, index) => {
                    return (
                      <div
                        key={`answer_${index}`}
                        className="font-medium bg-black mb-2 p-3 rounded text-white"
                      >
                        {answer}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-3">
                  <input
                    type="submit"
                    value="Accept"
                    className="rounded-lg py-2 px-10 text-center align-middle text-1xl hover:scale-105 
                font-bold text-white shadow-lg transition-all bg-blue-500"
                  />
                  <button
                    onClick={DiscardPrompt}
                    type="button"
                    value="Discard"
                    className="rounded-lg py-2 px-10 text-center align-middle text-1xl hover:scale-105 
                font-bold text-white shadow-md transition-all bg-red-500"
                  >
                    Discard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
