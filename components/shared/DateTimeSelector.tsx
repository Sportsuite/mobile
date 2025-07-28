import { Text, TouchableOpacity, useColorScheme } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "@/utils/formatDateTime";
import { getSize } from "@/utils/useScaleSize";

type DateTimeSelectorProps = {
  mode: "date" | "time";
  onDateChange: (date: Date) => void;
  title: string;
  minDate?: Date;
};

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  mode,
  onDateChange,
  title,
  minDate,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);
  const colorScheme = useColorScheme();

  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
      onDateChange(selectedDate);
    }
  };

  const showPicker = () => setShow(true);
  return (
    <TouchableOpacity
      onPress={showPicker}
      style={{ width: getSize(38, "width") }}
      className="bg-LightGray rounded-xl px-6 py-4 dark:bg-black"
    >
      <Text className="font-montserratRegular text-pt-4 text-sm dark:text-white">
        {title}
      </Text>
      <Text className="font-montserratBold text-base dark:text-white">
        {mode === "date" ? formatDate(date) : date.getTime()}
      </Text>

      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          minimumDate={minDate}
        />
      )}
    </TouchableOpacity>
  );
};

export default DateTimeSelector;
