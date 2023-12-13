export const CREATE_HABIT = "CREATE_HABIT";
export const EDIT_HABIT = "EDIT_HABIT";

export const HABIT_TYPES = [
  {
    value: "fitness",
    name: "Fitness",
  },
  {
    value: "diet",
    name: "Diet",
  },
  {
    value: "school",
    name: "School",
  },
  {
    value: "screen-time",
    name: "Screen Time",
  },
  {
    value: "other",
    name: "Other",
  },
];

export const HABIT_END_DATE = "habitEndDate";
export const HABIT_NUMBER_OF_TIMES_TO_COMPLETE = "habitNumberOfTimesToComplete";

// Object with the names of the various input names which capitalized letters and spaces to make it user friendly
export const USER_FRIENDLY_INPUT_NAMES = {
  habitName: "Habit Name",
  habitStartDate: "Habit Start Date",
  habitType: "Habit Type",
  habitNumberOfTimesToComplete: "Number of Times Completed",
};

export const INPUT_ERRORS_TEMPLATE = {
  habitName: "",
  habitStartDate: "",
  habitType: "",
  habitNumberOfTimesToComplete: "",
  habitEndDate: ""
};
