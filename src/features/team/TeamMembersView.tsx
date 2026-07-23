import {
  useAppSelector,
} from '../../app/hooks';

import {
  selectTeamMemberSummaries,
  selectTeamStatistics,
} from './teamSelectors';

function TeamMembersView() {
  const teamMembers = useAppSelector(
    selectTeamMemberSummaries,
  );

  const teamStatistics = useAppSelector(
    selectTeamStatistics,
  );

  return (
    <section className="workspace-view">
      <header className="view-heading">
        <div>
          <p className="page-eyebrow">
            Team workspace
          </p>

          <h1>Team members</h1>

          <p>
            View employee workload and task
            activity across CLM and LogiRate.
          </p>
        </div>
      </header>

      <section className="statistics-grid">
        <article className="statistic-card">
          <div className="statistic-card-header">
            <span>Total members</span>

            <div className="statistic-icon">
              ♙
            </div>
          </div>

          <strong>
            {teamStatistics.totalMembers}
          </strong>

          <p>
            Employees in the workspace
          </p>
        </article>

        <article className="statistic-card">
          <div className="statistic-card-header">
            <span>Active members</span>

            <div className="statistic-icon">
              ◷
            </div>
          </div>

          <strong>
            {teamStatistics.activeMembers}
          </strong>

          <p>
            Working on active tasks
          </p>
        </article>

        <article className="statistic-card">
          <div className="statistic-card-header">
            <span>Total assignments</span>

            <div className="statistic-icon">
              ▦
            </div>
          </div>

          <strong>
            {teamStatistics.totalAssignments}
          </strong>

          <p>
            Task assignments across the team
          </p>
        </article>

        <article className="statistic-card">
          <div className="statistic-card-header">
            <span>Without tasks</span>

            <div className="statistic-icon">
              ○
            </div>
          </div>

          <strong>
            {
              teamStatistics.membersWithoutTasks
            }
          </strong>

          <p>
            Members currently unassigned
          </p>
        </article>
      </section>

      <section className="team-section">
        <div className="team-section-heading">
          <div>
            <h2>Team workload</h2>

            <p>
              Task counts are calculated from
              Redux selectors.
            </p>
          </div>
        </div>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <article
              key={member.id}
              className="team-member-card"
            >
              <div className="team-member-header">
                <div className="team-member-avatar">
                  {member.initials}
                </div>

                <div className="team-member-info">
                  <h3>{member.name}</h3>

                  <p>{member.role}</p>

                  <a
                    href={`mailto:${member.email}`}
                  >
                    {member.email}
                  </a>
                </div>
              </div>

              <div className="team-workload-summary">
                <div>
                  <span>Total tasks</span>

                  <strong>
                    {member.totalTasks}
                  </strong>
                </div>

                <div>
                  <span>In progress</span>

                  <strong>
                    {member.inProgressTasks}
                  </strong>
                </div>

                <div>
                  <span>Completed</span>

                  <strong>
                    {member.completedTasks}
                  </strong>
                </div>
              </div>

              <div className="team-status-breakdown">
                <span>
                  <i className="team-status-dot team-status-dot--todo" />

                  {member.todoTasks} to do
                </span>

                <span>
                  <i className="team-status-dot team-status-dot--progress" />

                  {member.inProgressTasks} in
                  progress
                </span>

                <span>
                  <i className="team-status-dot team-status-dot--review" />

                  {member.reviewTasks} review
                </span>

                <span>
                  <i className="team-status-dot team-status-dot--completed" />

                  {member.completedTasks}{' '}
                  completed
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default TeamMembersView;