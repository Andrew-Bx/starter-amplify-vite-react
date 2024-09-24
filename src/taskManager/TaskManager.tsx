import "@aws-amplify/ui-react/styles.css";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { TodoDataSource, TodoModel } from "../TodoDataSource";
import TodoList from "./todoList/TodoList";
import TodoSection from "./TodoSection";

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;

  padding-bottom: 1rem;
  overflow-y: auto;
`;

const StyledHeader = styled.h1`
  padding-left: 7vw;
  margin-bottom: 3rem;
`;

const StyledContent = styled.div`
  padding: 0 7vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
`;

const AddTaskButton = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.5em;
  background-color: ${(props) => props.theme.primaryGreen};
  color: white;
  cursor: pointer;

  &:active {
    background-color: #017055;
  }
`;

/** Presents the user's pending and done TODOs, allows adding new ones and editing existing ones. */
export default function TaskManager() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [addingNewTodo, setAddingNewTodo] = useState(false);

  // TODO: could extract an interface for TodoDataSource and provide implementation via context
  const todoDataSource = useMemo(() => new TodoDataSource(), []);

  useEffect(() => {
    const subscription = todoDataSource.getObservable().subscribe({
      next: (data) => {
        setTodos([...data.items]);
        setIsDataLoaded(true);
      },
    });
    return () => subscription.unsubscribe();
  }, []);

  const pendingTasks = todos
    .filter((todo) => !todo.isDone)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  const doneTasks = todos
    .filter((todo) => todo.isDone)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? -1 : 1));

  if (!isDataLoaded) {
    // TODO improve this (eg show expected outline)
    return <StyledHeader>Loading...</StyledHeader>;
  }

  async function saveNewTodo(newName: string) {
    try {
      if (newName) {
        await todoDataSource.createTodo(newName);
      }
    } finally {
      setAddingNewTodo(false);
    }
  }

  return (
    <StyledMain>
      <StyledHeader>My tasks for the next month</StyledHeader>
      <StyledContent>
        <AddTaskButton
          onClick={() => setAddingNewTodo(true)}
          aria-label="Add task"
        >
          + Add task
        </AddTaskButton>

        <TodoSection title="Tasks to do">
          <TodoList
            emptyMessage="Nothing to do! You can relax or click the 'Add task' button above"
            todos={pendingTasks}
            onSaveNewTodo={addingNewTodo ? saveNewTodo : undefined}
            onUpdateTodo={(x) => todoDataSource.updateTodo(x)}
            onDeleteTodo={(x) => todoDataSource.deleteTodo(x)}
          />
        </TodoSection>

        {doneTasks.length > 0 && (
          <TodoSection title="Tasks done">
            <TodoList
              todos={doneTasks}
              onUpdateTodo={(x) => todoDataSource.updateTodo(x)}
              onDeleteTodo={(x) => todoDataSource.deleteTodo(x)}
            />
          </TodoSection>
        )}
      </StyledContent>
    </StyledMain>
  );
}
