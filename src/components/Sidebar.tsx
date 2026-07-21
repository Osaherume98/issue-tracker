import {
  employeesSelectors,
} from '../features/employees/employeesSlice';

import {
  projectSelected,
  projectsSelectors,
  selectSelectedProjectId,
} from '../features/projects/projectSlice';

import {
  useAppDispatch,
  useAppSelector,
} from '../app/hook';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const dispatch = useAppDispatch();

  const projects = useAppSelector(
    projectsSelectors.selectAll,
  );

  const employeesCount = useAppSelector(
    employeesSelectors.selectTotal,
  );

  const selectedProjectId = useAppSelector(
    selectSelectedProjectId,
  );

  const handleProjectSelection = (
    projectId: string | null,
  ): void => {
    dispatch(projectSelected(projectId));
    onClose();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${
          isOpen ? 'sidebar--open' : ''
        }`}
      >
        <div className="sidebar-brand">
          <div className="brand-logo">T</div>

          <div>
            <strong>TeamFlow</strong>
            <span>Project workspace</span>
          </div>
        </div>

        <nav
          className="sidebar-navigation"
          aria-label="Main navigation"
        >
          <p className="sidebar-section-label">
            Workspace
          </p>

          <button
            type="button"
            className="sidebar-link sidebar-link--active"
          >
            <span className="sidebar-icon">⌂</span>
            Overview
          </button>

          <button
            type="button"
            className="sidebar-link"
          >
            <span className="sidebar-icon">▦</span>
            Task board
          </button>

          <button
            type="button"
            className="sidebar-link"
          >
            <span className="sidebar-icon">♙</span>
            Team members

            <span className="sidebar-count">
              {employeesCount}
            </span>
          </button>

          <button
            type="button"
            className="sidebar-link"
          >
            <span className="sidebar-icon">◉</span>
            Notifications

            <span className="notification-dot" />
          </button>
        </nav>

        <section className="sidebar-projects">
          <div className="sidebar-section-heading">
            <p className="sidebar-section-label">
              Projects
            </p>

            <button
              type="button"
              className="sidebar-add-button"
              aria-label="Add project"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className={`project-link ${
              selectedProjectId === null
                ? 'project-link--active'
                : ''
            }`}
            onClick={() =>
              handleProjectSelection(null)
            }
          >
            <span className="project-dot project-dot--all" />
            All projects
          </button>

          {projects.map((project) => (
            <button
              type="button"
              key={project.id}
              className={`project-link ${
                selectedProjectId === project.id
                  ? 'project-link--active'
                  : ''
              }`}
              onClick={() =>
                handleProjectSelection(project.id)
              }
            >
              <span
                className="project-dot"
                style={{
                  backgroundColor: project.color,
                }}
              />

              <span>{project.name}</span>
            </button>
          ))}
        </section>

        <div className="sidebar-profile">
          <div className="profile-avatar">AO</div>

          <div className="profile-details">
            <strong>Amatip</strong>
            <span>Frontend Developer</span>
          </div>

          <button
            type="button"
            className="profile-menu-button"
            aria-label="Open profile menu"
          >
            ⋮
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;