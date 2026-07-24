import {
  // useEffect,
  // useRef,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';

import {
  useAppDispatch,
  useAppSelector,
} from '../app/hooks';

import {
  searchTermChanged,
  selectSearchTerm,
} from '../features/filters/filtersSlice';

import {
  notificationPanelToggled,
  selectUnreadNotificationCount,
} from '../features/notifications/notificationsSlice';

import {
  Bell,
  Menu,
  Plus,
  Search,
  X,
} from 'lucide-react';

interface HeaderProps {
  onOpenSidebar: () => void;
  onCreateTask: () => void;
}

function Header({
  onOpenSidebar,
  onCreateTask,
}: HeaderProps) {
  const dispatch = useAppDispatch();

  const searchTerm = useAppSelector(
    selectSearchTerm,
  );

  // const searchInputRef =
  //   useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   const handleKeyboardShortcut = (
  //     event: globalThis.KeyboardEvent,
  //   ): void => {
  //     const isSearchShortcut =
  //       (event.ctrlKey || event.metaKey) &&
  //       event.key.toLowerCase() === 'k';

  //     if (!isSearchShortcut) {
  //       return;
  //     }

  //     event.preventDefault();

  //     searchInputRef.current?.focus();
  //   };

  //   window.addEventListener(
  //     'keydown',
  //     handleKeyboardShortcut,
  //   );

  //   return () => {
  //     window.removeEventListener(
  //       'keydown',
  //       handleKeyboardShortcut,
  //     );
  //   };
  // }, []);

  const unreadNotificationCount =
  useAppSelector(
    selectUnreadNotificationCount,
  );


  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    dispatch(
      searchTermChanged(
        event.target.value,
      ),
    );
  };

  const handleSearchKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key !== 'Escape') {
      return;
    }

    dispatch(searchTermChanged(''));

    event.currentTarget.blur();
  };

  return (
    <header className="topbar">
      <button
        type="button"
        className="mobile-menu-button"
        aria-label="Open navigation"
        onClick={onOpenSidebar}
      >
        <Menu size={22} />
      </button>

      <label className="global-search">
        <span aria-hidden="true">
          <Search size={18} />
        </span>

        <input
          // ref={searchInputRef}
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search tasks by title or description"
          aria-label="Search tasks"
        />
        {searchTerm && (
          <button
            type="button"
            className="search-clear-button"
            onClick={() =>
              dispatch(searchTermChanged(''))
            }
            aria-label="Clear task search"
          >
            <X size={16} />
          </button>
        )}
      </label>

      <div className="topbar-actions">
        <button
            type="button"
            className="icon-button"
            aria-label="View notifications"
            onClick={() =>
                dispatch(notificationPanelToggled())
            }
            >
            <Bell size={18} />

            {unreadNotificationCount > 0 && (
                <span className="icon-button-badge">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
            </span>
        )}
        </button>

        <button
          type="button"
          className="create-task-button"
          onClick={onCreateTask}
        >
          <Plus size={17} />
          Create task
        </button>
      </div>
    </header>
  );
}

export default Header;