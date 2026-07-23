import { useAppSelector } from '../../app/hooks';

import type { Task } from '../../types';

import {
  selectVisibleTasksByStatus,
} from './tasksSlice';

import TaskColumn from './TaskColumn';

interface TaskBoardProps {
  onEditTask: (task: Task) => void;
}

function TaskBoard({
  onEditTask,
}: TaskBoardProps) {
  const todoTasks = useAppSelector((state) =>
    selectVisibleTasksByStatus(
      state,
      'todo',
    ),
  );

  const progressTasks = useAppSelector(
    (state) =>
      selectVisibleTasksByStatus(
        state,
        'in-progress',
      ),
  );

  const reviewTasks = useAppSelector(
    (state) =>
      selectVisibleTasksByStatus(
        state,
        'review',
      ),
  );

  const completedTasks = useAppSelector(
    (state) =>
      selectVisibleTasksByStatus(
        state,
        'completed',
      ),
  );

  return (
    <div className="kanban-board">
      <TaskColumn
        title="To do"
        status="todo"
        tasks={todoTasks}
        colorClass="status-marker--todo"
        onEditTask={onEditTask}
      />

      <TaskColumn
        title="In progress"
        status="in-progress"
        tasks={progressTasks}
        colorClass="status-marker--progress"
        onEditTask={onEditTask}
      />

      <TaskColumn
        title="Review"
        status="review"
        tasks={reviewTasks}
        colorClass="status-marker--review"
        onEditTask={onEditTask}
      />

      <TaskColumn
        title="Completed"
        status="completed"
        tasks={completedTasks}
        colorClass="status-marker--completed"
        onEditTask={onEditTask}
      />
    </div>
  );
}

export default TaskBoard;