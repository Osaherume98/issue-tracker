import { useAppSelector } from '../../app/hooks';

import {
  selectVisibleTasksByStatus,
} from './tasksSlice';

import TaskColumn from './TaskColoumn';

function TaskBoard() {
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
      />

      <TaskColumn
        title="In progress"
        status="in-progress"
        tasks={progressTasks}
        colorClass="status-marker--progress"
      />

      <TaskColumn
        title="Review"
        status="review"
        tasks={reviewTasks}
        colorClass="status-marker--review"
      />

      <TaskColumn
        title="Completed"
        status="completed"
        tasks={completedTasks}
        colorClass="status-marker--completed"
      />
    </div>
  );
}

export default TaskBoard;