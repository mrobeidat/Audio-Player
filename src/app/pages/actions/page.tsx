"use client";
import React, { useState, useEffect } from "react";
import { Images } from "../../components/Shared/Media/Images";
import Image from "next/image";
import { formatDate } from "../../../../libs/utils";
import { Particle } from "../../components/Shared/Particles/Particles";
import { GridLoader } from "react-spinners";
import AOS from "aos";
import "aos/dist/aos.css";
import { Dropdown } from "flowbite-react";

interface UserAction {
  userAction: string;
  createdAt: string;
  songTitle: string;
  isPlaying: boolean;
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
        console.log("Fetched data:", JSON.stringify(data));

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
  const NextCount = actionCounts["Next"] || 0;
  const ForwardCount = actionCounts["Forward"] || 0;
  const BackwardCount = actionCounts["Backward"] || 0;
  const PrevCount = actionCounts["Prev"] || 0;
  const SeekCount = actionCounts["Seek"] || 0;
  const MuteCount = actionCounts["Mute"] || 0;
  const UnmuteCount = actionCounts["Unmute"] || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <GridLoader color="#fff" size={30} />
      </div>
    );
  }
  // Check if the response is empty
  if (!actions || actions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white">No user actions available.</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex justify-center mt-28 -mb-28">
        {/* Drop Down  */}
        <Dropdown
          label="Filter Actions"
          className="z-30 backdrop-blur bg-black/30 rounded-2xl"
          style={{
            backgroundColor: "rgba(10, 10, 0, 0.4)",
            backdropFilter: "blur(80px)",
            zIndex: "99",
            borderRadius: "100px",
          }}
        >
          {/* Dropdown items */}
          <Dropdown.Item
            data-aos="flip-up"
            data-aos-easing="ease-in-quad"
            data-aos-once="true"
            // data-aos-offset="50"
            // data-aos-anchor-placement="top-bottom"
            onClick={() => handleFilterChange("All")}
            className="flex gap-2 hover:bg-black/20 rounded-3xl text-white"
          >
            All ({AllActionsCount})
          </Dropdown.Item>
          {[
            { action: "Play", count: PlayCount },
            { action: "Pause", count: PauseCount },
            { action: "Next", count: NextCount },
            { action: "Forward", count: ForwardCount },
            { action: "Backward", count: BackwardCount },
            { action: "Prev", count: PrevCount },
            { action: "Seek", count: SeekCount },
            { action: "Mute", count: MuteCount },
            { action: "Unmute", count: UnmuteCount },
          ].map(({ action, count }) => (
            <Dropdown.Item
              // data-aos="flip-up"
              // data-aos-easing="ease-in"
              // data-aos-once="true"
              key={action}
              onClick={() => handleFilterChange(action)}
              className="flex text-white gap-2 hover:bg-black/20 rounded-3xl"
            >
              <Image
                draggable="false"
                height={22}
                alt={action}
                src={Images[`${action}Icon`]}
              />
              {`${action.charAt(0).toUpperCase()}${action.slice(1)} (${count})`}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <div className="items-center justify-center grid gap-2 p-4 parent mt-28">
        {/* Particles animation */}
        <Particle isPlaying />

        {/* Sort the user actions based on date and time */}
        {filteredActions
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((action, index) => (
            <h2
              // data-aos="flip-up"
              // data-aos-easing="ease-in"
              // data-aos-once="true"
              // data-aos-offset="50"
              // data-aos-anchor-placement="top-bottom"
              key={index}
              className="backdrop-blur bg-black/30 block w-full px-4 py-2 text-base font-normal rounded-full text-white useraction-description "
            >
              {/* User Actions  */}
              <div className="flex sm:flex-row gap-2 items-center">
                {action.userAction && (
                  <div className="gap-2 flex items-center">
                    <Image
                      draggable="false"
                      height={22}
                      alt={action.userAction}
                      src={Images[`${action.userAction}Icon`]}
                    />
                    <p>{`Song -> (${action.songTitle}) • Action -> (${
                      action.userAction
                    }) • ${formatDate(action.createdAt)}`}</p>
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
