export default function formatDatesToMilliseconds(
  dateInput,
  timeInput,
) {
  const startDate = new Date(dateInput);
  startDate.setHours(timeInput.split(":")[0]);
  startDate.setMinutes(timeInput.split(":")[1]);
  return startDate.getTime();
}
// - backHoursGap * 60 * 60 * 1000
