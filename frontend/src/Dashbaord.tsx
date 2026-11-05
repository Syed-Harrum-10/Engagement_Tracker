import { useEffect, useState } from "react";
import { apiUrl } from "./api";

type TopCategory = { category: string; totalSeconds: number };
type DayViews = { day: string; views: number };

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours ? `${hours}h` : "",
    minutes || hours ? `${minutes}m` : "",
    `${seconds}s`,
  ].filter(Boolean).join(" ");
}

function formatDay(day: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(day));
}

function Dashboard() {
  const [top, setTop] = useState<TopCategory[]>([]);
  const [days, setDays] = useState<DayViews[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(apiUrl("/api/analytics/top-categories"), { headers }),
      fetch(apiUrl("/api/analytics/views-per-day"), { headers }),
    ])
      .then(async ([topResponse, daysResponse]) => {
        if (!topResponse.ok || !daysResponse.ok) throw new Error("Analytics could not be loaded.");
        return Promise.all([topResponse.json(), daysResponse.json()]);
      })
      .then(([topData, daysData]) => {
        setTop(topData);
        setDays(daysData);
      })
      .catch(() => setError("We couldn't load your insights. Please try again in a moment."))
      .finally(() => setLoading(false));
  }, []);

  const maxSeconds = Math.max(...top.map((item) => item.totalSeconds), 1);
  const maxViews = Math.max(...days.map((item) => item.views), 1);

  return (
    <main className="page-content">
      <section className="dashboard-title">
        <p className="eyebrow">Your activity</p>
        <h1>Insights</h1>
        <p>A little look at what has been catching your attention.</p>
      </section>
      {error ? (
        <div className="empty-state" role="alert">{error}</div>
      ) : loading ? (
        <div className="empty-state" role="status">Gathering your insights...</div>
      ) : (
        <section className="analytics-grid">
          <article className="analytics-card">
            <h2>Top categories</h2>
            {top.length ? (
              <div className="analytics-list">
                {top.map((item) => (
                  <div className="analytics-row" key={item.category}>
                    <div className="analytics-row-heading">
                      <span>{item.category}</span>
                      <span>{formatDuration(item.totalSeconds)}</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(item.totalSeconds / maxSeconds) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">Explore a few images to see your favorite categories.</div>
            )}
          </article>
          <article className="analytics-card">
            <h2>Views per day</h2>
            {days.length ? (
              <div className="analytics-list">
                {days.map((item) => (
                  <div className="analytics-row" key={item.day}>
                    <div className="analytics-row-heading">
                      <span>{formatDay(item.day)}</span>
                      <span>{item.views} {item.views === 1 ? "view" : "views"}</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(item.views / maxViews) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">Your daily activity will appear here as you explore.</div>
            )}
          </article>
        </section>
      )}
    </main>
  );
}

export default Dashboard;
