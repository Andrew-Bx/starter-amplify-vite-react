import { ComponentProps, ComponentPropsWithoutRef } from "react";
import styled from "styled-components";

interface IconButtonProps
  extends Omit<ComponentPropsWithoutRef<"img">, "onClick"> {
  onClick: ComponentProps<"button">["onClick"];
}
function IconButton({
  className,
  onClick,
  "aria-label": ariaLabel,
  ...imgProps
}: IconButtonProps) {
  return (
    <button className={className} onClick={onClick} aria-label={ariaLabel}>
      <img {...imgProps} />
    </button>
  );
}

const StyledIconButton = styled(IconButton)`
  background-color: transparent;
  border: none;
  cursor: pointer;

  img {
    width: 1.3rem;
  }
`;

export function DeleteButton({
  onClick,
}: {
  onClick: ComponentProps<"button">["onClick"];
}) {
  return (
    <StyledIconButton src="/trash.svg" onClick={onClick} aria-label="Delete" />
  );
}

export function EditButton({
  onClick,
}: {
  onClick: ComponentProps<"button">["onClick"];
}) {
  return (
    <StyledIconButton src="/pencil.svg" onClick={onClick} aria-label="Edit" />
  );
}
