import "@aws-amplify/ui-react/styles.css";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Header = styled.header`
  flex-shrink: 0;
  background-color: black;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
`;

const TitleSpan = styled.span`
  color: white;
  font-size: xx-large;
  font-weight: bold;
`;

const SignOutButton = styled.button`
  background: lightblue;
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  border: 1px solid white;
  cursor: pointer;
  text-transform: uppercase;
`;

interface AppHeaderProps {
  userName: string;
  onSignOut: () => void;
}

export default function AppHeader({ userName, onSignOut }: AppHeaderProps) {
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  return (
    <>
      <Header>
        <TitleSpan>Checked</TitleSpan>
        <SignOutButton
          title="Logout"
          aria-label="logout"
          onClick={() => setShowSignOutDialog(true)}
        >
          {userName?.slice(0, 1)}
        </SignOutButton>
      </Header>
      <SignOutDialog
        dialogVisible={showSignOutDialog}
        signoutConfirmed={onSignOut}
        dialogClosed={() => setShowSignOutDialog(false)}
      ></SignOutDialog>
    </>
  );
}

interface SignOutDialogProps {
  dialogVisible: boolean;
  signoutConfirmed: () => void;
  dialogClosed: () => void;
}

function SignOutDialog({
  dialogVisible,
  signoutConfirmed,
  dialogClosed,
}: SignOutDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.addEventListener("close", dialogClosed);
    return () => dialogRef.current?.removeEventListener("close", dialogClosed);
  });

  useEffect(() => {
    if (dialogVisible) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [dialogRef, dialogVisible]);

  return (
    <dialog ref={dialogRef}>
      <h3>Are you sure you want to logout?</h3>
      <button onClick={signoutConfirmed}>Logout</button>{" "}
      <button onClick={dialogClosed}>Stay</button>
    </dialog>
  );
}
