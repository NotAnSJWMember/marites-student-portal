import React from "react";
import styles from "./TimeTable.module.scss";
import { useDataContext } from "hooks/contexts/DataContext";
import { differenceInMinutes, format, parse } from "date-fns";
import { findDataById } from "utils/findDataById";
import { findDataByUserId } from "utils/findDataByUserId";
import { findDataByCourseId } from "utils/findDataByCourseId";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimeTable = ({ schedules }) => {
  const { dataState: courses } = useDataContext("course");
  const { dataState: sections } = useDataContext("section");
  const { dataState: instructors } = useDataContext("instructor");

  const schedulesByDay = daysOfWeek.map((day) => ({
    day,
    schedules: schedules.filter((schedule) => schedule.days.includes(day)),
  }));

  const formatTime = (hour, minute = 0) => {
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return format(date, "hh:mm a");
  };

  const earliestTime = schedules.reduce((earliest, schedule) => {
    const time = parse(schedule.startTime, "hh:mm a", new Date());
    return time < earliest ? time : earliest;
  }, new Date("9999-12-31"));

  const latestTime = schedules.reduce((latest, schedule) => {
    const time = parse(schedule.endTime, "hh:mm a", new Date());
    return time > latest ? time : latest;
  }, new Date("1970-01-01"));

  const startHour = earliestTime.getHours();
  const endHour = latestTime.getHours();

  const calculateHeight = (course, startTime, endTime) => {
    const start = parse(startTime, "hh:mm a", new Date());
    const end = parse(endTime, "hh:mm a", new Date());

    const duration = differenceInMinutes(end, start);

    const height = ((duration * 2 + 60) / 60) * 40;
    return height;
  };

  return (
    <div className={styles.timetable}>
      <div className={styles.tableGrid}>
        {/* Header: Days of the Week */}
        <div className={styles.header}>
          <p>Time</p>
          {daysOfWeek.map((day) => (
            <p key={day}>{day}</p>
          ))}
        </div>

        {/* Body: Time slots and schedules */}
        <div
          className={styles.body}
          style={{ gridTemplateRows: `repeat(${startHour + 1}, 40px)` }}
        >
          {Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour).map(
            (hour) =>
              [0, 30].map((minute) => {
                const time = formatTime(hour, minute);
                return (
                  <div key={`row-${hour}-${minute}`} className={styles.timeSlot}>
                    {/* Time Column */}
                    <p className={styles.time}>{time}</p>

                    {/* Schedule Columns for Each Day */}
                    {daysOfWeek.map((day) => {
                      const daySchedules =
                        schedulesByDay.find((d) => d.day === day)?.schedules || [];
                      const schedule = daySchedules.find((sched) => sched.startTime === time);
                      const course = courses ? findDataById(courses, schedule?.courseId) : {};
                      const instructor = instructors
                        ? findDataByUserId(instructors, schedule?.instructorId)
                        : {};
                      const section = sections
                        ? findDataByCourseId(sections, schedule?.courseId)
                        : {};

                      return (
                        <div key={`${day}-${time}`} className={styles.schedContainer}>
                          {schedule !== undefined ? (
                            <div
                              className={styles.sched}
                              style={{
                                height: `${calculateHeight(
                                  course,
                                  schedule.startTime,
                                  schedule.endTime
                                )}px`,
                              }}
                            >
                              <p>
                                <strong>{course.description}</strong>
                              </p>
                              <div className={styles.info}>
                                <p className={styles.sectionDesc}>{section.description}</p>
                                <p className={styles.room}>Room {schedule.roomCode}</p>
                                <p className={styles.instructor}>
                                  {instructor.firstName} {instructor.lastName}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeTable;
