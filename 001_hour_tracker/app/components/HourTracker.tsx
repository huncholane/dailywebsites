"use client";
import { TimeSlot } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { CiSaveDown2, CiSquarePlus } from "react-icons/ci";

type Props = {};

type DetailedSlotTime = TimeSlot & {
  duration: number;
  hours: number;
  minutes: number;
  seconds: number;
  hoursStr: string;
  minutesStr: string;
  secondsStr: string;
};

const HourTracker = (props: Props) => {
  const [trackState, setTrackState] = useState({
    id: 0,
    task: "",
    isTracking: false,
    hours: 0,
    minutes: 0,
    seconds: 0,
    trackFunction: null as NodeJS.Timeout | null,
  });
  const [timeslots, setTimeslots] = useState<DetailedSlotTime[]>([]);
  const [timeslotsLoaded, setTimeslotsLoaded] = useState(false);
  const [timeslotTotal, setTimeslotTotal] = useState({} as DetailedSlotTime);

  const updateTotals = (detailedTimeslots: DetailedSlotTime[]) => {
    const totals = detailedTimeslots.reduce(
      (acc: DetailedSlotTime, slot: DetailedSlotTime) => {
        acc.hours += slot.hours;
        acc.minutes += slot.minutes;
        acc.seconds += slot.seconds;
        return acc;
      },
      { hours: 0, minutes: 0, seconds: 0 } as DetailedSlotTime
    );
    totals.hoursStr = String(totals.hours).padStart(2, "0");
    totals.minutesStr = String(totals.minutes).padStart(2, "0");
    totals.secondsStr = String(totals.seconds).padStart(2, "0");
    setTimeslotTotal(totals);
  };

  useEffect(() => {
    const fetchTimeslots = async () => {
      const response = await fetch("/api/track");
      const data = await response.json();
      const detailedData = data.map(detailedTimeSlot).reverse();
      setTimeslotsLoaded(true);
      setTimeslots(detailedData);
      updateTotals(detailedData);
    };
    fetchTimeslots();
  }, []);

  const detailedTimeSlot = (timeslot: TimeSlot) => {
    const duration = timeslot.endTime
      ? (new Date(timeslot.endTime).getTime() -
          new Date(timeslot.startTime).getTime()) /
        1000
      : 0;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return {
      ...timeslot,
      duration,
      hours,
      minutes,
      seconds,
      hoursStr: String(hours).padStart(2, "0"),
      minutesStr: String(minutes).padStart(2, "0"),
      secondsStr: String(seconds).padStart(2, "0"),
    };
  };

  const startTracking = async () => {
    if (trackState.isTracking) return;
    if (!trackState.task) return alert("Please enter a task");
    const response = await fetch("/api/track", {
      method: "POST",
      body: JSON.stringify(trackState),
    });
    const result = await response.json();
    setTrackState({
      ...trackState,
      isTracking: true,
      trackFunction: setInterval(() => {
        setTrackState((prevState) => {
          const newSeconds = prevState.seconds + 1;
          const newMinutes = prevState.minutes + Math.floor(newSeconds / 60);
          const newHours = prevState.hours + Math.floor(newMinutes / 60);
          return {
            ...prevState,
            id: result.id,
            seconds: newSeconds % 60,
            minutes: newMinutes % 60,
            hours: newHours,
          };
        });
      }, 1000),
    });
  };

  const stopTracking = async () => {
    const response = await fetch("/api/track", {
      method: "POST",
      body: JSON.stringify(trackState),
    });
    const result = await response.json();
    trackState.trackFunction && clearInterval(trackState.trackFunction);
    setTrackState({
      ...trackState,
      isTracking: false,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  };

  const handleTracking = async () => {
    if (trackState.isTracking) {
      await stopTracking();
    } else {
      await startTracking();
    }
  };

  return (
    <div className="p-2">
      {timeslotsLoaded && (
        <div className="flex h-8">
          <input
            required
            className="w-full h-full"
            type="text"
            placeholder="What are you working on??"
            value={trackState.task}
            onChange={(e) => {
              setTrackState({ ...trackState, task: e.target.value });
            }}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await startTracking();
              }
            }}
          />
          <div className="mx-3 bg-white flex">
            <input
              type="text"
              className="w-12"
              placeholder="00"
              value={trackState.hours}
              readOnly
            />
            :
            <input
              type="text"
              className="w-8"
              placeholder="00"
              value={trackState.minutes}
              readOnly
            />
            :
            <input
              type="text"
              className="w-8"
              placeholder="00"
              value={trackState.seconds}
              readOnly
            />
          </div>
          {!trackState.isTracking && (
            <div className="flex">
              <div>Start</div>
              <CiSquarePlus
                size={32}
                className="text-green-300 hover:text-green-500 cursor-pointer"
                onClick={handleTracking}
              />
            </div>
          )}
          {trackState.isTracking && (
            <div className="flex">
              <div>Stop</div>
              <CiSaveDown2
                size={32}
                className="text-blue-300 hover:text-blue-500 cursor-pointer"
                onClick={handleTracking}
              />
            </div>
          )}
        </div>
      )}
      <div className="mt-4 mb-2">
        <div className="flex text-lg font-bold">
          <h2 className="w-full">Total Time</h2>
          <div>
            {timeslotTotal.hoursStr}:{timeslotTotal.minutesStr}:
            {timeslotTotal.secondsStr}
          </div>
        </div>
        <ul>
          {timeslots.map((slot) => (
            <li key={slot.id} className="flex w-full">
              <div className="w-full">{slot.description}</div>
              <div className="flex w-52 justify-end">
                <div>{slot.hoursStr}</div>:<div>{slot.minutesStr}</div>:
                <div>{slot.secondsStr}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HourTracker;
