import { FormEvent, useEffect, useState } from "react";
import {
  CreatorPromptOptions,
  DefaultOptions,
  Options,
  Prompt,
} from "../../Types/Creator";
import Api from "../../Api";
import { OptionCheck } from "./OptionCheck";
import { TemperatureRange } from "./TemperatureRange";
import { Textarea } from "@headlessui/react";
import { GeneratedPrompt } from "./GeneratedPrompt";

export const AICreator = () => {
  const [promptNote, setPromptNote] = useState<string>("");
  const [generatedPrompt, setGeneratedPrompt] = useState<Prompt | undefined>(
    undefined
  );
  const [options, setOptions] = useState<Options>(DefaultOptions);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    Api.get("creator/options")
      .then((response) => {
        setOptions((prev) => {
          return {
            ...prev,
            DefaultPrompt: response.data.defaultPrompt,
            Temperature: response.data.temperature * 10,
            MaxGenerations: response.data.maxGenerations,
          };
        });
      })
      .catch((error) => {
        console.error("Error fetching creator options:", error);
      });
  }, []);

  const DiscardPropmt = () => {
    setGeneratedPrompt(() => {
      return undefined;
    });
  };

  const GeneratePrompt = async (e: FormEvent) => {
    e.preventDefault();

    setIsGenerating(true);

    const promptOptions: CreatorPromptOptions = {
      AdditionalPromptNote: promptNote,
      GenerateAnswers: options.GenerateAnswers,
      GenerateQuestion: options.GenerateQuestion,
    };

    await Api.post("creator/generate", promptOptions)
      .then((response) => {
        setIsGenerating(false);
        setGeneratedPrompt((prev) => {
          return {
            TokensUsed: response.data.tokensUsed,
            AnswerCount: response.data.answerCount,
            Question: response.data.question,
            Answers: response.data.answers,
          };
        });
      })
      .catch((error) => {
        console.error("Error submitting options:", error);
      });
  };

  if (generatedPrompt !== undefined) {
    return (
      <GeneratedPrompt
        DiscardPrompt={DiscardPropmt}
        GeneratedPrompt={generatedPrompt}
      ></GeneratedPrompt>
    );
  }

  return (
    <form
      onSubmit={async (e) => await GeneratePrompt(e)}
      className="flex flex-col overflow-x-hidden w-screen mt-10 items-center"
    >
      <div className="md:max-w-5xl w-screen pb-3">
        <div className="bg-white bg-opacity-20 p-3 rounded">
          <div className="mb-6 flex justify-center text-white">
            <div className="opacity-100 w-full duration-150 ease-linear">
              <div className="relative w-full text-black">
                <div className="relative w-full h-full bg-transparent border-2 border-black rounded bg-white">
                  <div className=" absolute pl-3 ">
                    <p className="flex items-center gap-1 inset-0 font-medium transition-all pointer-events-none bg-transparentfocused-text justify-start">
                      Default Prompt
                      <span className="text-sm text-gray-800">(readonly)</span>
                    </p>
                  </div>
                  <Textarea
                    readOnly
                    value={options.DefaultPrompt}
                    className="inset-0 w-full placeholder:text-black outline-none bg-transparent pt-4 pl-3 h-full"
                  />
                </div>
                <div className="relative w-full h-full mt-4 bg-transparent border-2 border-black rounded bg-white">
                  <div className="absolute pl-3">
                    <p className="flex inset-0 gap-1 items-center font-medium transition-all pointer-events-none bg-transparent focused-text justify-start">
                      Additional Prompt Note
                      <span className="text-sm text-gray-800">
                        (not required) (max 80 characters)
                      </span>
                    </p>
                  </div>
                  <Textarea
                    value={promptNote}
                    onChange={(e) => setPromptNote(e.target.value)}
                    className="inset-0 w-full text-lg placeholder:text-black outline-none bg-transparent pt-4 pl-3 h-full"
                  />
                </div>
              </div>
              <div className="flex pt-3 gap-3">
                <OptionCheck
                  title="Generate Answers"
                  value={options.GenerateAnswers}
                  valueChanged={() => {
                    setOptions((prev) => {
                      return {
                        ...prev,
                        GenerateAnswers: !prev.GenerateAnswers,
                      };
                    });
                  }}
                ></OptionCheck>
                <OptionCheck
                  title="Generate Question"
                  value={options.GenerateQuestion}
                  valueChanged={() => {
                    setOptions((prev) => {
                      return {
                        ...prev,
                        GenerateQuestion: !prev.GenerateQuestion,
                      };
                    });
                  }}
                ></OptionCheck>
                <OptionCheck
                  title="Batch"
                  value={options.EnableBatch}
                  valueChanged={() => {
                    setOptions((prev) => {
                      return {
                        ...prev,
                        EnableBatch: !prev.EnableBatch,
                      };
                    });
                  }}
                ></OptionCheck>
              </div>
              {options.EnableBatch && (
                <div className="flex text-sm flex-col pt-2 text-black font-medium">
                  <span>
                    Batch Count <span className="text-gray-800">(max 5)</span>
                  </span>
                  <input
                    max={5}
                    min={1}
                    onChange={(e) => {
                      setOptions((prev) => {
                        return {
                          ...prev,
                          BatchCount: parseInt(e.target.value),
                        };
                      });
                    }}
                    defaultValue={options.BatchCount}
                    className="border-2 border-black w-14 rounded px-1 py-0.5"
                    type="number"
                  />
                </div>
              )}
              <TemperatureRange
                value={options.Temperature}
                valueChanged={(value) =>
                  setOptions((prev) => {
                    return { ...prev, Temperature: value };
                  })
                }
              ></TemperatureRange>
            </div>
          </div>
          <div className="flex justify-center">
            <input
              type="submit"
              className="rounded-lg py-2 px-10 text-center align-middle text-1xl hover:scale-105 
                font-bold text-white shadow-md transition-all bg-black"
              value={isGenerating ? "Please wait ..." : "Generate"}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
