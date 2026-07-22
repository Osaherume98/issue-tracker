import type { Task } from '../../types';

import {
  employeesSelectors,
} from '../employees/employeesSlice';

import {
  useAppSelector,
} from '../../app/hooks';


interface TaskCardProps {
  task: Task;
}


function TaskCard({
  task,
}: TaskCardProps) {

  const employees = useAppSelector(
    employeesSelectors.selectAll,
  );


  const assignedEmployees =
    employees.filter((employee) =>
      task.assignedEmployeeIds.includes(
        employee.id,
      ),
    );


  const priorityClass =
    `priority priority-${task.priority}`;


  return (
    <article className="task-card">

      <div className="task-card-header">

        <h4>
          {task.title}
        </h4>

        <span className={priorityClass}>
          {task.priority}
        </span>

      </div>


      <p className="task-description">
        {task.description}
      </p>


      <div className="task-meta">

        <span>
          Due:
          {' '}
          {task.dueDate}
        </span>

      </div>


      <div className="task-footer">

        <div className="employee-avatars">

          {assignedEmployees.map(
            (employee) => (
              <span
                key={employee.id}
                className="employee-avatar"
                title={employee.name}
              >
                {employee.initials}
              </span>
            ),
          )}

        </div>


        <button
          type="button"
          className="task-action"
        >
          ⋮
        </button>

      </div>


    </article>
  );
}


export default TaskCard;