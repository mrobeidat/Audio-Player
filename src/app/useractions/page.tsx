"use client";
import React, { useState, useEffect } from "react";
import Images from "../components/Shared/Images";
import Image from "next/image";
import { formatDate } from "../../../libs/utils";
import Link from "next/link";
import Particle from "../components/Shared/Particle";

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
        <p className="text-white">Loading...</p>
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
    <div className="p-3 !mb-4">
      <Link
        href={"/"}
        type="button"
        className="text-white m-3 bg-gradient-to-br from-pink-500 to-red-800 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        ᐊ Back to Home Page
      </Link>

      <div className="items-center justify-center h-screen grid grid-cols-3 gap-2 p-4 sm:p-32 flex-col parent mb-4">
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
              className="block w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-red-950 dark:border-gray-600 dark:text-white hover:bg-blue-100 useraction-description focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-600"
            >
              <div className="flex sm:flex-row gap-2 items-center">
                {action.userAction === "Play" && (
                  <div className="gap-2 flex items-center">
                    <Image
                      draggable="false"
                      height={22}
                      alt="Play"
                      src={Images.Play}
                    />
                    <p>{`Audio Played ${formatDate(action.createdAt)}`}</p>
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
                    <p>{`Audio Forwarded ${formatDate(action.createdAt)}`}</p>
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
                    <p>{`Audio Backwarded ${formatDate(action.createdAt)}`}</p>
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
                    <p>{`Audio Paused ${formatDate(action.createdAt)}`}</p>
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
                    <p>{`Audio Muted ${formatDate(action.createdAt)}`}</p>
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
                    <p>{`Audio Unmuted ${formatDate(action.createdAt)}`}</p>
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
