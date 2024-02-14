"use client";
import React, { useState, useEffect } from "react";
import Images from "../../components/Shared/Images";
import Image from "next/image";
import { formatDate } from "../../../../libs/utils";
import Particle from "../../components/Shared/Particle";
import { GridLoader } from "react-spinners";
import AOS from "aos";
import "aos/dist/aos.css";
import { Dropdown } from "flowbite-react";

interface UserAction {
  userAction: string;
  createdAt: string;
}

const UserActions: React.FC = () => {
  const [actions, setActions] = useState<UserAction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("All"); // Filteration based on action type

  // Initializing AOS animations to set up animations on component mount
  useEffect(() => {
    AOS.init({
      duration: 400,
      easing: "ease-in",
    });
    AOS.refresh();
  }, []);

  // Fetch the user actions from the server once the component is mounted
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

        // Check the data type of the response
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

  // Filter user actions by type
  const filteredActions = actions.filter((action) => {
    if (filter === "All") return true;
    return action.userAction === filter;
  });

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };
  // Show the count of each user action
  const actionCounts = actions.reduce((counts, action) => {
    counts[action.userAction] = (counts[action.userAction] || 0) + 1;
    return counts;
  }, {});

  const AllActionsCount = actions.length;
  const PlayCount = actionCounts["Play"] || 0;
  const PauseCount = actionCounts["Pause"] || 0;
  const ForwardCount = actionCounts["Forward"] || 0;
  const BackwardCount = actionCounts["Backward"] || 0;
  const MuteCount = actionCounts["Mute"] || 0;
  const UnmuteCount = actionCounts["Unmute"] || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <GridLoader color="#fff" size={30} />
      </div>
    );
  }
  // Check if there is a response from the server
  if (!actions || actions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No user actions available.</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex justify-center mb-4 mt-20 ">
        {/* Drop Down  */}

        <Dropdown
          label="Filter Actions"
          className="z-30 backdrop-blur-lg bg-black/30 rounded-2xl"
          style={{
            backgroundColor: "rgba(10, 10, 0, 0.4)",
            backdropFilter: "blur(80px)",
            zIndex: "99",
          }}
        >
          <Dropdown.Item
            onClick={() => handleFilterChange("All")}
            className="flex gap-2 hover:bg-black/20 rounded-3xl"
          >
            All ({AllActionsCount})
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleFilterChange("Play")}
            className="flex gap-2 hover:bg-black/20 rounded-3xl"
          >
            <Image
              draggable="false"
              height={22}
              alt="Pause"
              src={Images.PlayIcon}
            />
            Play ({PlayCount})
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleFilterChange("Pause")}
            className="flex gap-2 hover:bg-black/20 rounded-3xl"
          >
            <Image
              draggable="false"
              height={22}
              alt="Pause"
              src={Images.PauseIcon}
            />
            Pause ({PauseCount})
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleFilterChange("Forward")}
            className="flex gap-2 hover:bg-black/20 rounded-3xl"
          >
            <Image
              draggable="false"
              height={22}
              alt="Forward"
              src={Images.ForwardIcon}
            />
            Forward ({ForwardCount})
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleFilterChange("Backward")}
            className="flex gap-2 hover:bg-black/20 rounded-3xl"
          >
            <Image
              draggable="false"
              height={22}
              alt="Backward"
              src={Images.BackwardIcon}
            />
            Backward ({BackwardCount})
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleFilterChange("Mute")}
            className="flex gap-2 hover:bg-black/20 rounded-3xl"
          >
            <Image
              draggable="false"
              height={22}
              alt="Mute"
              src={Images.MuteIcon}
            />
            Mute ({MuteCount})
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleFilterChange("Unmute")}
            className="flex gap-2 hover:bg-black/20 rounded-3xl"
          >
            <Image
              draggable="false"
              height={22}
              alt="Unmute"
              src={Images.UnmuteIcon}
            />
            Unmute ({UnmuteCount})
          </Dropdown.Item>
        </Dropdown>
      </div>
      <div className="items-center justify-center grid grid-cols-3 gap-2 p-4 flex-col parent mt-9">
        {/* Particles animation */}
        <Particle />

        {/* Sort the user actions based on date and time */}
        {filteredActions
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
              className="backdrop-blur bg-black/30 block w-full px-4 py-2 text-lg font-medium rounded-lg text-white useraction-description "
            >
              {/* User Actions  */}
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
                      src={Images.PlayIcon}
                    />
                    <p>{`Audio Played • ${formatDate(action.createdAt)}`}</p>
                  </div>
                )}
                {action.userAction === "Pause" && (
                  <div className="gap-2 flex items-center">
                    <Image
                      draggable="false"
                      height={22}
                      alt="Pause"
                      src={Images.PauseIcon}
                    />
                    <p>{`Audio Paused • ${formatDate(action.createdAt)}`}</p>
                  </div>
                )}
                {action.userAction === "Forward" && (
                  <div className="gap-2 flex items-center">
                    <Image
                      draggable="false"
                      height={22}
                      alt="Forward"
                      src={Images.ForwardIcon}
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
                      src={Images.BackwardIcon}
                    />
                    <p>{`Audio Backwarded • ${formatDate(
                      action.createdAt
                    )}`}</p>
                  </div>
                )}
                {action.userAction === "Mute" && (
                  <div className="gap-2 flex items-center">
                    <Image
                      draggable="false"
                      height={22}
                      alt="Mute"
                      src={Images.MuteIcon}
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
                      src={Images.UnmuteIcon}
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
