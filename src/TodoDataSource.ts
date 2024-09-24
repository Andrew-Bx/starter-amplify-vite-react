import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

export type TodoModel = Schema["Todo"]["type"];
export type TodoUpdateModel = Schema["Todo"]["updateType"];

type TodoClientModel = ReturnType<
  typeof generateClient<Schema>
>["models"]["Todo"];

/** Source for TODO models, performs CRUDL on the remote data store */
export class TodoDataSource {
  readonly #todoClientModel: TodoClientModel;

  readonly #modelObserver: ReturnType<TodoClientModel["observeQuery"]>;

  constructor() {
    this.#todoClientModel = generateClient<Schema>().models.Todo;
    this.#modelObserver = this.#todoClientModel.observeQuery();
  }

  public getObservable() {
    return this.#modelObserver;
  }

  public async createTodo(name: string) {
    await this.#todoClientModel.create({ name });
  }

  public async deleteTodo(id: string) {
    await this.#todoClientModel.delete({ id });
  }

  public async updateTodo(updatedTodo: TodoUpdateModel) {
    await this.#todoClientModel.update(updatedTodo);
  }
}