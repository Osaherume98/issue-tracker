import {
  selectTasksByStatus,
} from './tasksSlice';

import {
  useAppSelector,
} from '../../app/hooks';


import TaskColumn from './TaskColoumn';


function TaskBoard() {


  const todoTasks =
    useAppSelector(
      selectTasksByStatus('todo'),
    );


  const progressTasks =
    useAppSelector(
      selectTasksByStatus(
        'in-progress',
      ),
    );


  const reviewTasks =
    useAppSelector(
      selectTasksByStatus(
        'review',
      ),
    );


  const completedTasks =
    useAppSelector(
      selectTasksByStatus(
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