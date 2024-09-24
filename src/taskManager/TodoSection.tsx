import { ComponentProps, useId, useState } from "react";
import styled from "styled-components";

const StyledSection = styled.section`
  width: 100%;
`;

const SectionHeading = styled.h2`
  display: flex;
  gap: 1rem;
  cursor: pointer;
`;

const ChevronContainer = styled.div`
  display: inline-flex;
  align-items: center;
`;

const RotatingChevron = styled.div<{ $down: boolean }>`
  display: inline-block;
  width: 0.5em;
  height: 0.5em;

  border-bottom: 3px solid darkgray;
  border-right: 3px solid darkgray;
  transform: rotate(${(props) => (props.$down ? "45deg" : "-135deg")});
  transition: transform 0.3s ease;
`;

interface TodoSectionProps extends ComponentProps<"section"> {
  title: string;
}

export default function TodoSection({ title, children }: TodoSectionProps) {
  const headingId = useId();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <StyledSection aria-labelledby={headingId}>
      <SectionHeading id={headingId} onClick={() => setIsExpanded(!isExpanded)}>
        {title}
        <ChevronContainer>
          <RotatingChevron $down={isExpanded} />
        </ChevronContainer>
      </SectionHeading>
      {isExpanded && children}
    </StyledSection>
  );
}
