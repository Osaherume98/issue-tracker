import {
  employeesSelectors,
} from '../features/employees/employeesSlice';

import {
  projectSelected,
  projectsSelectors,
  selectSelectedProjectId,
} from '../features/projects/projectsSlice';

import ResetWorkspaceButton from '../components/ResetWorkspaceButton';

import {
  useAppDispatch,
  useAppSelector,
} from '../app/hooks';

import {
  activeViewChanged,
  selectActiveView,
  type WorkspaceView,
} from '../features/ui/uiSlice';

import {
  notificationPanelOpened,
} from '../features/notifications/notificationsSlice';

import {
  Bell,
  CircleUserRound,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Users,
} from 'lucide-react';

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
    dispatch(activeViewChanged('overview'));
    onClose();
  };

  const activeView = useAppSelector(
    selectActiveView,
);

  const handleViewChange = (
    view: WorkspaceView,): void => {
    dispatch(activeViewChanged(view));
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
          {/* <div className="brand-logo">T</div> */}
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
        className={`sidebar-link ${
            activeView === 'overview'
            ? 'sidebar-link--active'
            : ''
        }`}
        onClick={() =>
            handleViewChange('overview')
        }
        >
        <span className="sidebar-icon">
            <LayoutDashboard size={18} />
        </span>

        Overview
        </button>

        <button
        type="button"
        className={`sidebar-link ${
            activeView === 'tasks'
            ? 'sidebar-link--active'
            : ''
        }`}
        onClick={() =>
            handleViewChange('tasks')
        }
        >
        <span className="sidebar-icon">
            <FolderKanban size={18} />
        </span>

        Task board
        </button>

        <button
        type="button"
        className={`sidebar-link ${
            activeView === 'team'
            ? 'sidebar-link--active'
            : ''
        }`}
        onClick={() =>
            handleViewChange('team')
        }
        >
        <span className="sidebar-icon">
            <Users size={18} />
        </span>

        Team members

        <span className="sidebar-count">
            {employeesCount}
        </span>
        </button>

        <button
        type="button"
        className="sidebar-link"
        onClick={() => {
            dispatch(
            notificationPanelOpened(),
            );

            onClose();
        }}
        >
        <span className="sidebar-icon">
            <Bell size={18} />
        </span>

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
              <Plus size={16} />
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

        <div className="sidebar-reset-area">
            <ResetWorkspaceButton />
        </div>
        <div className="sidebar-profile">
          <div className="profile-avatar">DNG</div>

          <div className="profile-details">
            <strong>DARUM NG</strong>
          </div>

          <button
            type="button"
            className="profile-menu-button"
            aria-label="Open profile menu"
          >
            <CircleUserRound size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;