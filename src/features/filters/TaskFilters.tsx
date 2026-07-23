import {
  useAppDispatch,
  useAppSelector,
} from '../../app/hooks';

import {
  employeesSelectors,
} from '../employees/employeesSlice';

import {
  employeeFilterChanged,
  filtersCleared,
  overdueFilterChanged,
  priorityFilterChanged,
  selectEmployeeFilter,
  selectHasActiveFilters,
  selectOverdueOnly,
  selectPriorityFilter,
  type PriorityFilter,
} from './filtersSlice';

interface TaskFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

function TaskFilters({
  isOpen,
  onClose,
}: TaskFiltersProps) {
  const dispatch = useAppDispatch();

  const employees = useAppSelector(
    employeesSelectors.selectAll,
  );

  const employeeId = useAppSelector(
    selectEmployeeFilter,
  );

  const priority = useAppSelector(
    selectPriorityFilter,
  );

  const overdueOnly = useAppSelector(
    selectOverdueOnly,
  );

  const hasActiveFilters =
    useAppSelector(
      selectHasActiveFilters,
    );

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="filter-panel-overlay"
        aria-label="Close task filters"
        onClick={onClose}
      />

      <section
        className="filter-panel"
        aria-label="Task filters"
      >
        <header className="filter-panel-header">
          <div>
            <h3>Filter tasks</h3>

            <p>
              Narrow down the work shown on
              the board.
            </p>
          </div>

          <button
            type="button"
            className="filter-close-button"
            onClick={onClose}
            aria-label="Close filters"
          >
            ×
          </button>
        </header>

        <div className="filter-panel-body">
          <label className="filter-field">
            <span>Assigned employee</span>

            <select
              value={employeeId}
              onChange={(event) =>
                dispatch(
                  employeeFilterChanged(
                    event.target.value,
                  ),
                )
              }
            >
              <option value="all">
                All employees
              </option>

              {employees.map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.name}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Priority</span>

            <select
              value={priority}
              onChange={(event) =>
                dispatch(
                  priorityFilterChanged(
                    event.target
                      .value as PriorityFilter,
                  ),
                )
              }
            >
              <option value="all">
                All priorities
              </option>

              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>

              <option value="urgent">
                Urgent
              </option>
            </select>
          </label>

          <label className="overdue-filter">
            <input
              type="checkbox"
              checked={overdueOnly}
              onChange={(event) =>
                dispatch(
                  overdueFilterChanged(
                    event.target.checked,
                  ),
                )
              }
            />

            <span className="filter-checkbox">
              {overdueOnly ? '✓' : ''}
            </span>

            <span>
              <strong>
                Overdue tasks only
              </strong>

              <small>
                Completed tasks are not
                considered overdue.
              </small>
            </span>
          </label>
        </div>

        <footer className="filter-panel-footer">
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              dispatch(filtersCleared())
            }
            disabled={!hasActiveFilters}
          >
            Clear filters
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={onClose}
          >
            View results
          </button>
        </footer>
      </section>
    </>
  );
}

export default TaskFilters;