import styles from './Dashboard.module.css';
import DashboardSidebar from './DashboardSidebar/DashboardSidebar';

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <DashboardSidebar />
      <div className={styles.content}></div>
    </div>
  );
}

export default Dashboard;
