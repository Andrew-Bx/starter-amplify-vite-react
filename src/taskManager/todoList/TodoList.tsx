import "@aws-amplify/ui-react/styles.css";
import { useState } from "react";
import styled from "styled-components";
import { TodoModel, TodoUpdateModel } from "../../TodoDataSource";
import { DatePickerButton } from "./DatePickerButton";
import { DeleteButton, EditButton } from "./IconButtons";

const TodoTableContainer = styled.div`
  width: 100%;
  container-type: inline-size;
`;

const TodoTable = styled.table`
  background-color: white;
  border: 1px solid lightgray;
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  td,
  th {
    padding: 5px;
    text-align: left;
    border-bottom: 1px solid lightgray;
  }

  thead > tr {
    /* checkbox column: */
    & > th:nth-child(1) {
      width: 4rem;
    }
    /* (let the name column expand to fill remaining width) */
    /* due-date column: */
    & > th:nth-child(3) {
      width: 10rem;
    }
    /* actions column: */
    & > th:nth-child(4) {
      width: 6rem;
    }
  }

  /* for narrow screens, abandon table layout and display each row as a 'card' (using grid layout) */
  @container (max-width: 40rem) {
    thead {
      display: none;
    }

    table,
    tr,
    td {
      display: block;
    }

    tr {
      display: grid;
      grid-template: 1fr auto / 50px 1fr;
      border-bottom: 1px solid lightgray;
    }

    td {
      border: none;
    }

    /* make the checkbox take the full height of the card: */
    td:nth-child(1) {
      grid-row-start: 1;
      grid-row-end: 4;
    }

    /* don't show empty date cells: */
    td.empty {
      display: none;
    }

    /* hide the action buttons: */
    td:nth-child(4) {
      display: none;
    }
  }
`;

interface TodoListProps {
  /** The message to show when there are no todos.  If omitted, nothing is rendered when there are no todos */
  emptyMessage?: string;

  todos: TodoModel[];

  /** When provided, causes a 'new row' to be shown at the bottom of the table.
   *
   * This gets called when the user has confirmed the name of the new TODO.
   */
  onSaveNewTodo?: (name: string) => Promise<void>;

  onUpdateTodo: (updatedTodo: TodoUpdateModel) => Promise<void>;

  onDeleteTodo: (id: string) => Promise<void>;
}

/** Displays a table of TODOs (or for narrow viewport a simple list).
 *
 * Allows adding a new TODO, as well as editing existing ones.
 */
export default function TodoList({
  emptyMessage,
  todos,
  onSaveNewTodo,
  onUpdateTodo,
  onDeleteTodo,
}: TodoListProps) {
  const newTodoIsBeingAdded = !!onSaveNewTodo;

  // normally only one item will be edited at a time, but you can start editing before the
  // previous one has finished editing, hence having a `Set` of ids
  const [idsBeingEdited, setIdsBeingEdited] = useState<Set<string>>(new Set());

  if (todos.length === 0 && !newTodoIsBeingAdded) {
    if (!emptyMessage) return null;
    return <span>{emptyMessage}</span>;
  }

  async function updateName(id: string, newName: string) {
    await onUpdateTodo({ id, name: newName });
    setIdsBeingEdited((ids) => {
      ids.delete(id);
      return new Set(ids);
    });
  }

  return (
    <TodoTableContainer>
      <TodoTable>
        <thead>
          <tr>
            <th></th>
            <th>Task name</th>
            <th>Due date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>
                <input
                  type="checkbox"
                  checked={!!todo.isDone}
                  onChange={() =>
                    onUpdateTodo?.({ id: todo.id, isDone: !todo.isDone })
                  }
                />
              </td>
              <td>
                <EditableTaskName
                  savedName={todo.name}
                  todoIsDone={!!todo.isDone}
                  onSave={
                    idsBeingEdited.has(todo.id)
                      ? (newName: string) => updateName(todo.id, newName)
                      : undefined
                  }
                />
              </td>
              <td className={todo.dueDate ? "" : "empty"}>
                <DatePickerButton
                  value={todo.dueDate}
                  onUpdate={
                    todo.isDone
                      ? undefined
                      : (newValue: string) => {
                          onUpdateTodo?.({
                            id: todo.id,
                            dueDate: newValue || null,
                          });
                        }
                  }
                />
              </td>
              <td>
                {!todo.isDone && (
                  <span>
                    <EditButton
                      onClick={() =>
                        setIdsBeingEdited((ids) => new Set(ids.add(todo.id)))
                      }
                    />
                    <DeleteButton onClick={() => onDeleteTodo(todo.id)} />
                  </span>
                )}
              </td>
            </tr>
          ))}
          {newTodoIsBeingAdded && (
            <tr>
              <td></td>
              <td>
                <AddableTaskName onSave={(name) => onSaveNewTodo(name)} />
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      </TodoTable>
    </TodoTableContainer>
  );
}

const NameSpan = styled.span<{ $isDone: boolean }>`
  font-weight: ${(props) => (props.$isDone ? "lighter" : "normal")};
`;

interface EditableTaskNameProps {
  savedName: string;
  todoIsDone: boolean;

  /** The callback to save the updated name.  When this is provided, the name renders as a text box */
  onSave?: (newName: string) => Promise<void>;
}

/** Component to display the name of the task, or if being editing then a text box */
function EditableTaskName({
  savedName,
  todoIsDone,
  onSave,
}: EditableTaskNameProps) {
  const isBeingEdited = !!onSave;
  const [editedName, setEditedName] = useState(savedName);
  const [isSaving, setIsSaving] = useState(false);

  async function saveEditedName() {
    setIsSaving(true);
    try {
      await onSave!(editedName);
    } finally {
      setIsSaving(false);
    }
  }

  return isBeingEdited ? (
    <input
      type="text"
      autoFocus={true}
      value={editedName}
      disabled={isSaving}
      onChange={(e) => setEditedName(e.target.value)}
      onBlur={saveEditedName}
      onKeyDown={async (e) => e.key === "Enter" && saveEditedName()}
    />
  ) : (
    <NameSpan $isDone={todoIsDone}>{savedName}</NameSpan>
  );
}

interface AddableTaskNameProps {
  onSave: (newName: string) => Promise<void>;
}

function AddableTaskName({ onSave }: AddableTaskNameProps) {
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function save() {
    setIsSaving(true);
    try {
      await onSave(name);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <input
      type="text"
      autoFocus={true}
      disabled={isSaving}
      placeholder="Write a task here&hellip;"
      value={name}
      onChange={(e) => setName(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => e.key === "Enter" && save()}
    />
  );
}
