import type {
  Task,
  TaskStatus,
} from '../../types';

import TaskCard from './TaskCard';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  colorClass: string;
  onEditTask: (task: Task) => void;
}

function TaskColumn({
  title,
  tasks,
  colorClass,
  onEditTask,
}: TaskColumnProps) {
  return (
    <article className="kanban-column">
      <header className="kanban-column-header">
        <div>
          <span
            className={`status-marker ${colorClass}`}
          />

          <h3>{title}</h3>
        </div>

        <span className="column-count">
          {tasks.length}
        </span>
      </header>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-column">
            <span>＋</span>
            <p>No tasks</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() =>
                onEditTask(task)
              }
            />
          ))
        )}
      </div>
    </article>
  );
}

export default TaskColumn;