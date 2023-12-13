import { useSelector, useDispatch } from "react-redux";
import {
  addUserHabit,
  updateUserHabit,
} from "../../src/redux/slices/userHabitsSlice";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRouter } from "next/router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import { Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControl from "@mui/material/FormControl";
import _forOwn from "lodash/forOwn";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import {
  CREATE_HABIT,
  EDIT_HABIT,
  HABIT_TYPES,
  HABIT_NUMBER_OF_TIMES_TO_COMPLETE,
  HABIT_END_DATE,
  USER_FRIENDLY_INPUT_NAMES,
  INPUT_ERRORS_TEMPLATE,
} from "../util/habitVariables";
import { cloneDeep } from "lodash";

const HabitForm = ({ formType }) => {
  const params = useParams();

  const userHabits = useSelector((state) => state.userHabits.userHabits);

  // Set to null if formType is CREATE_HABIT
  const habitToEdit =
    formType === CREATE_HABIT
      ? null
      : userHabits.find((habit) => {
          return habit.id === params.habitId;
        });

  // State for form inputs
  const [habitName, setHabitName] = useState("");
  const [habitStartDate, setHabitStartDate] = useState(dayjs());
  const [habitType, setHabitType] = useState("");
  const [habitLimit, setHabitLimit] = useState(false);
  const [habitLimitType, setHabitLimitType] = useState("");
  const [habitEndDate, setHabitEndDate] = useState("");
  const [habitNumberOfTimesToComplete, setHabitNumberOfTimesToComplete] =
    useState("");

  // State for form errors
  const [formErrors, setFormErrors] = useState(
    cloneDeep(INPUT_ERRORS_TEMPLATE)
  );

  const [emptyFieldsAlert, setEmptyFieldsAlert] = useState(false);
  const [inputErrorsAlert, setInputErrorsAlert] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.user.userDetails);

  const validateInputOnChange = (inputName, inputValue) => {
    const formErrorsUpdate = { ...formErrors };
    let ERROR_FOUND = "";

    if (inputName === HABIT_NUMBER_OF_TIMES_TO_COMPLETE) {
      const numberRegex = /^[0-9]*$/;
      if (!numberRegex.test(Number(inputValue))) {
        ERROR_FOUND = "Please enter a numeric value";
      }
    }
    if (inputName === HABIT_END_DATE) {
      if (dayjs(inputValue).diff(habitStartDate, "day") < 1) {
        ERROR_FOUND = `Habit end date must be after the habit start date of ${habitStartDate}`;
      }
    }
    if (!inputValue) {
      ERROR_FOUND = `Please fill in '${USER_FRIENDLY_INPUT_NAMES[inputName]}' field`;
    }

    formErrorsUpdate[inputName] = ERROR_FOUND;

    setFormErrors(formErrorsUpdate);
  };

  const noErrorsPresent = () => {
    let NO_ERRORS_PRESENT = true;

    _forOwn(formErrors, (value, key) => {
      if (value) {
        NO_ERRORS_PRESENT = false;
      }
    });
    return NO_ERRORS_PRESENT;
  };

  // TODO: Set error messages for each empty field
  const noEmptyFields = () => {
    let NO_EMPTY_FIELDS = true;

    if (!habitName || !habitStartDate || !habitType) {
      NO_EMPTY_FIELDS = false;
    }

    if (habitLimit) {
      if (habitLimitType === HABIT_END_DATE) {
        if (!habitEndDate) {
          NO_EMPTY_FIELDS = false;
        }
      } else if (habitLimitType === HABIT_NUMBER_OF_TIMES_TO_COMPLETE) {
        if (!habitNumberOfTimesToComplete) {
          NO_EMPTY_FIELDS = false;
        }
      }
    }

    return NO_EMPTY_FIELDS;
  };

  const habitLimitOnChangeHandler = (event) => {
    const { value } = event.target;
    setHabitLimit(value);
    // Reset the end date and number of days input when the habit limit input is set to false
    if (!value) {
      resetHabitLimitTypeInputs();
    }
  };

  const habitLimitTypeOnChangeHandler = (event) => {
    const { value } = event.target;

    setHabitLimitType(value);
    resetHabitLimitTypeInputs();
  };

  const resetHabitLimitTypeInputs = () => {
    setHabitEndDate("");
    setHabitNumberOfTimesToComplete("");

    setFormErrors({
      ...formErrors,
      habitNumberOfTimesToComplete: "",
      habitEndDate: "",
    });
  };

  const prepopulateHabitEditForm = () => {
    setHabitName(habitToEdit.habitName);
    setHabitStartDate(dayjs(habitToEdit.habitStartDate));
    setHabitType(habitToEdit.habitType);
    setHabitLimit(habitToEdit.habitLimit);
    if (habitToEdit.habitNumberOfTimesToComplete) {
      setHabitLimit(true);
      setHabitLimitType(HABIT_NUMBER_OF_TIMES_TO_COMPLETE);
      setHabitNumberOfTimesToComplete(habitToEdit.habitNumberOfTimesToComplete);
    } else if (habitToEdit.habitEndDate) {
      setHabitLimit(true);
      setHabitLimitType(HABIT_END_DATE);
      setHabitEndDate(dayjs(habitToEdit.habitEndDate));
    }
  };

  useEffect(() => {
    // If the formType is EDIT_HABIT, then set the initial values for the various state values
    if (formType === EDIT_HABIT && habitToEdit) {
      prepopulateHabitEditForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitToEdit, formType]);

  const habitSubmitHandler = () => {
    if (noErrorsPresent() && noEmptyFields()) {
      if (formType === CREATE_HABIT) {
        let createHabitPayload = {
          habitName,
          habitType,
          habitStartDate: habitStartDate.format("MM-DD-YYYY"),
          habitLimit,
          daysCompleted: [],
          uid: user.uid,
        };

        if (habitLimit) {
          if (habitLimitType === HABIT_END_DATE) {
            createHabitPayload = {
              ...createHabitPayload,
              habitEndDate: habitEndDate.format("MM-DD-YYYY"),
            };
          } else if (habitLimitType === HABIT_NUMBER_OF_TIMES_TO_COMPLETE) {
            createHabitPayload = {
              ...createHabitPayload,
              habitNumberOfTimesToComplete,
            };
          }
        }
        dispatch(addUserHabit(createHabitPayload));
      } else if (formType === EDIT_HABIT) {
        let updateHabitPayload = {
          id: habitToEdit.id,
          habitName: habitName,
          habitType: habitType,
          habitLimit: habitLimit,
          habitNumberOfTimesToComplete: "",
          habitEndDate: "",
        };

        if (habitLimit) {
          if (habitLimitType === HABIT_END_DATE) {
            updateHabitPayload = {
              ...updateHabitPayload,
              habitEndDate: habitEndDate.format("MM-DD-YYYY"),
              habitNumberOfTimesToComplete: "",
            };
          } else if (habitLimitType === HABIT_NUMBER_OF_TIMES_TO_COMPLETE) {
            updateHabitPayload = {
              ...updateHabitPayload,
              habitNumberOfTimesToComplete: habitNumberOfTimesToComplete,
              habitEndDate: "",
            };
          }
        }

        dispatch(updateUserHabit(updateHabitPayload));
      }
      setEmptyFieldsAlert(false);
      setInputErrorsAlert(false);
      router.push("/user-habits");
    } else {
      if (!noErrorsPresent()) {
        setInputErrorsAlert(true);
      } else {
        setInputErrorsAlert(false);
      }
      if (!noEmptyFields()) {
        setEmptyFieldsAlert(true);
      } else {
        setEmptyFieldsAlert(false);
      }
    }
  };

  const renderHabitLimitType = () => {
    if (habitLimitType === HABIT_END_DATE) {
      return (
        <Grid xs={12} md={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              name={HABIT_END_DATE}
              label="Habit End Date"
              minDate={dayjs(habitStartDate)}
              value={habitEndDate}
              onChange={(newValue) => {
                validateInputOnChange(HABIT_END_DATE, newValue);
                setHabitEndDate(newValue);
              }}
            />
          </LocalizationProvider>
        </Grid>
      );
    } else if (habitLimitType === HABIT_NUMBER_OF_TIMES_TO_COMPLETE) {
      return (
        <Grid xs={12} md={2}>
          <TextField
            error={formErrors.habitNumberOfTimesToComplete}
            helperText={formErrors.habitNumberOfTimesToComplete}
            name={HABIT_NUMBER_OF_TIMES_TO_COMPLETE}
            label="Number of times"
            value={habitNumberOfTimesToComplete}
            onChange={(event) => {
              setHabitNumberOfTimesToComplete(event.target.value);
              validateInputOnChange(event.target.name, event.target.value);
            }}
            onBlur={(event) => {
              validateInputOnChange(event.target.name, event.target.value);
            }}
          />
        </Grid>
      );
    }
  };

  return (
    <form>
      {emptyFieldsAlert && (
        <Alert className="alert margin-top-2 margin-bottom-2" severity="error">
          Input fields missing. Please fill in and click submit.
        </Alert>
      )}
      {inputErrorsAlert && (
        <Alert className="alert margin-top-2 margin-bottom-2" severity="error">
          Please fix all input errors.
        </Alert>
      )}
      {habitLimit && formType == EDIT_HABIT && (
        <Alert className="alert margin-top-2 margin-bottom-2" severity="warning">
          Days marked as completed will be reset if the habit limit is set to
          true
        </Alert>
      )}

      <Grid container rowSpacing={5} columnSpacing={{ xs: 1 }}>
        <Grid xs={12} md={2}>
          <TextField
            error={formErrors.habitName}
            helperText={formErrors.habitName}
            name="habitName"
            label="Habit Name"
            value={habitName}
            onChange={(event) => {
              setHabitName(event.target.value);
              validateInputOnChange(event.target.name, event.target.value);
            }}
            onBlur={(event) =>
              validateInputOnChange(event.target.name, event.target.value)
            }
          />
        </Grid>
        {formType === CREATE_HABIT && (
          <Grid xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="habitStartDate"
                label="Habit Start Date"
                value={habitStartDate}
                error={formErrors.habitStartDate ? true : false}
                onChange={(newValue) => setHabitStartDate(newValue)}
              />
            </LocalizationProvider>
          </Grid>
        )}

        <Grid xs={12} md={2}>
          <FormControl
            sx={{ width: "100%" }}
            error={formErrors.habitType ? true : false}
          >
            <InputLabel id="habit-type-label">Habit Type</InputLabel>
            <Select
              labelId="habit-type-label"
              value={habitType}
              size="large"
              name="habitType"
              label="Habit Type"
              onChange={(event) => {
                setHabitType(event.target.value);
                validateInputOnChange(event.target.name, event.target.value);
              }}
              onBlur={(event) =>
                validateInputOnChange(event.target.name, event.target.value)
              }
            >
              {HABIT_TYPES.map((habitType) => {
                return (
                  <MenuItem key={habitType.value} value={habitType.value}>
                    {habitType.name}
                  </MenuItem>
                );
              })}
            </Select>
            {formErrors.habitType && (
              <FormHelperText>{formErrors.habitType}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
      <Grid container rowSpacing={5} columnSpacing={{ xs: 1 }}>
        <Grid xs={12} md={2}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="habit-limit-label">Habit Limit</InputLabel>
            <Select
              labelId="habit-limit-label"
              value={habitLimit}
              size="large"
              name="habitLimit"
              label="Habit Limit"
              onChange={(event) => habitLimitOnChangeHandler(event)}
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {habitLimit && (
          <>
            <Grid xs={12} md={2}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="habit-limit-type-label">Limit Type</InputLabel>
                <Select
                  labelId="habit-limit-type-label"
                  value={habitLimitType}
                  size="large"
                  name="habitLimitType"
                  label="Habit Limit"
                  onChange={(event) => habitLimitTypeOnChangeHandler(event)}
                >
                  <MenuItem value={HABIT_NUMBER_OF_TIMES_TO_COMPLETE}>
                    Number of Times Completed
                  </MenuItem>
                  <MenuItem value={HABIT_END_DATE}>Habit End Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {renderHabitLimitType()}
          </>
        )}
      </Grid>

      <Button
        className="margin-top-2 margin-bottom-3"
        onClick={habitSubmitHandler}
        variant="contained"
      >
        Submit
      </Button>
    </form>
  );
};

export default HabitForm;
