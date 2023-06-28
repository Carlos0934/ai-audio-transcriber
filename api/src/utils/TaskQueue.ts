import { Evt } from "evt";

type Task<T> = () => Promise<T>;

type QueueEvent = "taskAdded" | "taskCompleted" | "taskCanceled";

interface TaskItem<T> {
  task: Task<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
  canceled: boolean;
}

export class TaskQueue<T> {
  private readonly queue: TaskItem<T>[] = [];
  private running: number;
  private readonly concurrency: number;
  private evt = Evt.create<QueueEvent>();

  constructor(concurrency: number) {
    this.queue = [];
    this.running = 0;
    this.concurrency = concurrency;

    this.handleTasks();
  }

  addTask(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const taskItem: TaskItem<T> = {
        task,
        resolve,
        reject,
        canceled: false,
      };

      this.queue.push(taskItem);
      this.evt.post("taskAdded");
    });
  }

  cancelTask(task: Task<T>): void {
    const taskItem = this.queue.find((item) => item.task === task);
    if (taskItem) {
      taskItem.canceled = true;
      this.evt.post("taskCanceled");
    }
  }

  private handleTasks() {
    this.evt.attach(() => {
      const canProcessTask =
        this.running < this.concurrency && this.queue.length > 0;

      if (!canProcessTask) return;

      this.processTask();
    });
  }

  private async processTask(): Promise<void> {
    const taskItem = this.queue.shift();
    if (!taskItem || taskItem.canceled) return;

    this.running++;
    try {
      const result = await taskItem.task();
      taskItem.resolve(result);
    } catch (error) {
      taskItem.reject(error);
    } finally {
      this.running--;
      this.evt.post("taskCompleted");
    }
  }
}
