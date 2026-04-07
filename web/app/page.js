"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [url, setUrl] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      const jobsArray = Object.entries(data).map(([id, info]) => ({
        id,
        ...info,
      })).reverse();
      setJobs(jobsArray);
    } catch (e) {
      console.error("Failed to fetch status.");
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        setUrl("");
        fetchJobs();
      } else {
        alert("Failed to submit job.");
      }
    } catch (err) {
      alert("Error submitting request.");
    }
    setLoading(false);
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Extract & Transcribe</h1>
        <p className={styles.subtitle}>
          Turn any YouTube video into high-quality Audio and Text instantly.
        </p>
      </header>

      <div className={styles.glassPanel}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Paste YouTube Link Here..."
              className={styles.input}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className={styles.button} disabled={loading || !url}>
              {loading ? "Processing..." : "Extract"}
            </button>
          </div>
        </form>
      </div>

      <div className={styles.jobsContainer}>
        <div className={styles.jobsList}>
          {jobs.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.jobInfo}>
                <div className={styles.jobTitle}>{job.title || job.url}</div>
                <div className={styles.jobStatus}>
                  {job.status === "pending" && "Waiting in queue..."}
                  {job.status === "downloading" && (
                    <><div className={styles.spinner}></div> Extracting Audio...</>
                  )}
                  {job.status === "transcribing" && (
                    <><div className={styles.spinner}></div> Transcribing to Text...</>
                  )}
                  {job.status === "completed" && <span style={{ color: "var(--success-color)" }}>Ready!</span>}
                  {job.status === "error" && <span className={styles.errorState}>Error: {job.error}</span>}
                </div>
              </div>

              {job.status === "completed" && (
                <div className={styles.actions}>
                  <a
                    href={`/api/download?type=audio&jobId=${job.id}`}
                    className={styles.downloadBtn}
                    download
                  >
                    Audio
                  </a>
                  <a
                    href={`/api/download?type=text&jobId=${job.id}`}
                    className={styles.downloadBtn}
                    download
                  >
                    Transcript
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
