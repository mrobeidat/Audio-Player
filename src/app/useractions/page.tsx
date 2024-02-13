"use client";
import React, { useState, useEffect } from "react";
import Images from "../components/Shared/Images";
import Image from "next/image";
import { formatDate } from "../../../libs/utils";
import Particle from "../components/Shared/Particle";
import { FadeLoader } from "react-spinners";

interface UserAction {
  userAction: string;
  createdAt: string;
}

const UserActions: React.FC = () => {
  const [Actions, setActions] = useState<UserAction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/useractions", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        console.log("Fetched data:", data);

        if (Array.isArray(data.actions)) {
          setActions(data.actions);
        } else {
          throw new Error("Data is not in the expected format");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading user actions", error);
        setActions([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FadeLoader color="#ffffff" />
      </div>
    );
  }

  if (!Actions || Actions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No user actions available.</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="items-center justify-center h-screen grid grid-cols-3 gap-2 p-4 sm:p-32 flex-col parent mt-9">
        <Particle />
        {Actions.filter((action) => action.userAction !== "")
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((action, index) => (
            <h2
              data-aos="fade-up"
              data-aos-easing="ease-in"
              data-aos-once="true"
              data-aos-delay={`${index * 100}`}
              key={index}
              className="backdrop-blur-sm bg-white/30 block w-full px-4 py-2 text-sm font-medium text-gray-900  rounded-lg  dark:text-white useraction-description "
            >
              <div className="flex sm:flex-row gap-2 items-center">
                {action.userAction === "Play" && (
                  <div
                    className="gap-2 flex items-center"
                    data-tooltip-target="tooltip-default"
                  >
                    <Image
                      draggable="false"
                      height={22}
                      alt="Play"
                      src={Images.Play}
                    />
                    <p>{`Audio Played • ${formatDate(action.createdAt)}`}</p>
                  </div>
                )}
                {action.userAction === "Forward" && (
                  <div className="gap-2 flex items-center">
                    <Image
                      draggable="false"
                      height={22}
                      alt="Forward"
                      src={Images.Forward}
                    />
                    <p>{`Audio Forwarded • ${formatDate(action.createdAt)}`}</p>
                  </div>
                )}
                {action.userAction === "Backward" && (
                  <div className="gap-2 flex items-center">
                    <Image
                      draggable="false"
                      height={22}
                      alt="Backward"
                      src={Images.Backward}
                    />
                    <p>{`Audio Backwarded • ${formatDate(
                      action.createdAt
                    )}`}</p>
                  </div>
                )}
                {action.userAction === "Pause" && (
                  <div className="gap-2 flex items-center">
                    <Image
                      draggable="false"
                      height={22}
                      alt="Pause"
                      src={Images.Pause}
                    />
                    <p>{`Audio Paused • ${formatDate(action.createdAt)}`}</p>
                  </div>
                )}
                {action.userAction === "Mute" && (
                  <div className="gap-2 flex items-center">
                    <Image
                      draggable="false"
                      height={22}
                      alt="Mute"
                      src={Images.Mute}
                    />
                    <p>{`Audio Muted • ${formatDate(action.createdAt)}`}</p>
                  </div>
                )}
                {action.userAction === "Unmute" && (
                  <div className="gap-2 flex items-center">
                    <Image
                      draggable="false"
                      height={22}
                      alt="Unmute"
                      src={Images.Unmute}
                    />
                    <p>{`Audio Unmuted • ${formatDate(action.createdAt)}`}</p>
                  </div>
                )}
              </div>
            </h2>
          ))}
      </div>
    </div>
  );
};
export default UserActions;
