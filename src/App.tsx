import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import {
  createGlobalStyle,
  DefaultTheme,
  ThemeProvider,
} from "styled-components";
import TaskManager from "./taskManager/TaskManager";
import AppHeader from "./AppHeader";

const theme: DefaultTheme = {
  primaryGreen: "#00c495",
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background-color: snow;
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  }

  #root {
    height: 100vh;
    width: 100vw;

    display: flex;
    flex-direction: column;

    div[data-amplify-authenticator] {
      height: 100%;
    }
  }

  input[type="checkbox"] {
    accent-color: ${(props) => props.theme.primaryGreen};
    height: 1.1rem;
    width: 1.1rem;
  }

  input[type="text"] {
    width: 100%;

    &:focus {
      outline-color: ${(props) => props.theme.primaryGreen};
    }
  }

  th {
    font-weight: normal;
  }

  dialog::backdrop {
    background: #00000099;
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Authenticator>
        {({ signOut, user }) =>
          user && signOut ? (
            <>
              <AppHeader
                userName={
                  user.signInDetails?.loginId || user.username || user.userId
                }
                onSignOut={signOut}
              />
              <TaskManager />
            </>
          ) : (
            <></>
          )
        }
      </Authenticator>
    </ThemeProvider>
  );
}

export default App;
