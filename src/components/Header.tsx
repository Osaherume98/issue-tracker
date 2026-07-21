interface HeaderProps {
  onOpenSidebar: () => void;
}

function Header({
  onOpenSidebar,
}: HeaderProps) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="mobile-menu-button"
        aria-label="Open navigation"
        onClick={onOpenSidebar}
      >
        ☰
      </button>

      <label className="global-search">
        <span aria-hidden="true">⌕</span>

        <input
          type="search"
          placeholder="Search tasks, projects or team members"
          aria-label="Search"
        />

        <kbd>Ctrl K</kbd>
      </label>

      <div className="topbar-actions">
        <button
          type="button"
          className="icon-button"
          aria-label="View notifications"
        >
          ♢
          <span className="icon-button-badge">3</span>
        </button>

        <button
          type="button"
          className="create-task-button"
        >
          <span>+</span>
          Create task
        </button>
      </div>
    </header>
  );
}

export default Header;