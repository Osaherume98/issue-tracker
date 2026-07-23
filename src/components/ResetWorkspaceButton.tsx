import {
  clearPersistedWorkspace,
} from '../app/persistence';

function ResetWorkspaceButton() {
  const handleReset = (): void => {
    const shouldReset =
      window.confirm(
        'Reset all saved workspace data? This will restore the original tasks after the page reloads.',
      );

    if (!shouldReset) {
      return;
    }

    clearPersistedWorkspace();

    window.location.reload();
  };

  return (
    <button
      type="button"
      className="reset-workspace-button"
      onClick={handleReset}
    >
      Reset workspace
    </button>
  );
}

export default ResetWorkspaceButton;