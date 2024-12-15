import React from "react";
import { useAppTypeContext } from "../../../contexts/appTypeContext";
import IconButton from "../../basic/IconButton";
import { XMarkIcon } from "@heroicons/react/24/solid";

function LeaderboardPage() {
  const { leaderboard, closeWebview } = useAppTypeContext();
  const items = [
    { name: "John Doe 1", score: 100 },
    {
      name: "Jane Doe 2 dede d eded ed ed ededededede de ed ed ed ed ed e d",
      score: 200,
    },
    { name: "Jane Doe 3", score: 300 },
    { name: "Jane Doe 4", score: 400 },
    { name: "Jane Doe 5", score: 500 },
    { name: "Jane Doe 6", score: 600 },
    { name: "John Doe 7", score: 700 },
    { name: "Jane Doe 8", score: 800 },
    { name: "Jane Doe 9", score: 900 },
    { name: "Jane Doe 10", score: 1000 },
    { name: "Jane Doe 11", score: 1100 },
    { name: "Jane Doe 12", score: 1200 },
  ];
  return (
    <div className="flex flex-col items-center h-screen w-screen  max-h-screen bg-[#227e6b]">
      <div className="w-full max-w-[320px] xxs:max-w-[420px] max-h-screen pb-4">
        <div className="relative flex justify-center w-full">
          <div className=" font-extrabold text-4xl mt-8 mb-6 text-custom-bg">
            Leaderboard
          </div>
          <div className="absolute right-0 top-8">
            <IconButton
              color="white"
              icon={<XMarkIcon className="h-5 w-5" />}
              onClick={() => {
                closeWebview();
              }}
            />
          </div>
        </div>

        <div className="max-h-[70%] overflow-scroll py-2">
          <ul role="list" className="space-y-3 w-full">
            {leaderboard?.map((item, index) => (
              <li
                key={item.member}
                className="overflow-hidden rounded-md bg-custom-bg px-4 py-2 shadow w-full"
              >
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <div className="text-custom-border font-extrabold mr-2">
                      {index + 1}.
                    </div>
                    <div className="text-custom-border font-extrabold truncate mr-4">
                      {item.member}
                    </div>
                  </div>
                  <div className="text-custom-border font-extrabold">
                    {new Date(item.score * 1000).toISOString().substr(14, 5)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
