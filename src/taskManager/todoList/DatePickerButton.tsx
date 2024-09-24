import styled from "styled-components";

const DatePickerContainer = styled.div`
  position: relative;
`;

const PositionedInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  left: 0;
  right: 0%;
  top: 0;
  bottom: 0;
`;

interface DatePickerButtonProps {
  /** in YYYY-MM-DD format */
  value?: string | null;

  onUpdate?: (newValue: string) => void;
}

/** Displays current date value, and allows selecting new value.
 *
 * Appears transparent when no value selected.  Clicking opens a date picker.
 * (Uses browser's native date picker for best a11y support.)
 */
export function DatePickerButton({ value, onUpdate }: DatePickerButtonProps) {
  const formattedDate = formatDateForDisplay(value);

  if (!onUpdate) return formattedDate;

  return (
    <DatePickerContainer>
      <span>{formattedDate || <>&nbsp;</>}</span>
      <PositionedInput
        type="date"
        title="Select Due Date"
        aria-label="Select Due Date"
        value={value || ""}
        onChange={(e) => onUpdate(e.target.value || "")}
        onClick={(e) => (e.nativeEvent.target as HTMLInputElement).showPicker()}
      />
    </DatePickerContainer>
  );
}

function formatDateForDisplay(value: string | null | undefined): string {
  if (!value) return "";

  const isToday = value === getCurrentDateAsString();
  const prefix = isToday ? "Today - " : "";
  const localizedDate = new Date(value).toLocaleDateString("default", {
    day: "numeric",
    month: "short",
  });

  return `${prefix}${localizedDate}`;
}

function getCurrentDateAsString() {
  return new Date().toISOString().split("T")[0];
}
