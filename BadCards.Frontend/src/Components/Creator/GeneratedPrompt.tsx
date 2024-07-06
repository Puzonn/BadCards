import { FormEvent } from "react";
import Api from "../../Api";
import { Prompt } from "../../Types/Creator";

export const GeneratedPrompt = ({
  GeneratedPrompt,
  DiscardPrompt
}: {
  DiscardPrompt: () => void;
  GeneratedPrompt: Prompt;
}) => {
  const AcceptPrompt = async (e: FormEvent) => {
    e.preventDefault();
    await Api.put("/creator/accept", GeneratedPrompt)
      .then((response) => {
        console.log(response.data);
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
      <div className="md:w-1/2 w-screen pb-3">
        <div className="bg-white bg-opacity-20 px-3 pb-1 rounded">
          <div className="mb-6 flex justify-center text-white">
            <div className="opacity-100 w-full duration-150 ease-linear">
              <div className="relative w-full text-black">
                <div className="flex flex-col justify-center">
                  <div className="mt-4 pb-4 font-medium flex gap-3">
                    <span className="bg-black text-white p-2 rounded">
                      Token Used: {GeneratedPrompt.TokensUsed}
                    </span>
                    <span className="bg-black text-white p-2 rounded">
                      Answer Count: {GeneratedPrompt.AnswerCount}
                    </span>
                    <span className="bg-black text-white p-2 rounded">
                      Translated: PL/US
                    </span>
                  </div>
                  <span className="font-bold py-1">Generated Question: </span>
                  <div className="font-medium relative justify-start w-full bg-black text-white p-3 rounded">
                    {GeneratedPrompt.Question}
                  </div>
                  <span className="font-bold py-1">Generated Answers: </span>
                  {GeneratedPrompt.Answers.map((answer, index) => {
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
