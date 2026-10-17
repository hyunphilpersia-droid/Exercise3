"use client";

import { useState, useEffect } from "react";
import NoteItem from "./components/NoteItem";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load saved notes once on first render
  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
    setLoaded(true);
  }, []);

  // Save notes whenever they change
  useEffect(() => {
    if (loaded) localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes, loaded]);

  // BONUS: check if the note already exists while typing
  useEffect(() => {
    const t = title.trim().toLowerCase();
    if (!t) return setError("");
    const exists = notes.some(
      (n) => n.title.trim().toLowerCase() === t && n.id !== editingId
    );
    setError(exists ? "A note with this title already exists." : "");
  }, [title, notes, editingId]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || error) return;

    if (editingId) {
      // UPDATE
      setNotes(notes.map((n) =>
        n.id === editingId ? { ...n, title: title.trim(), description: description.trim() } : n
      ));
    } else {
      // ADD
      setNotes([{ id: Date.now(), title: title.trim(), description: description.trim() }, ...notes]);
    }
    resetForm();
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setDescription(note.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // DELETE
  const handleDelete = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Loadout home">
          <span className="brand-mark">L</span>
          <span>LOADOUT<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-status"><span className="status-dot" /> PERSONAL STRATEGY DESK</div>
        <span className="season-tag">SEASON 01</span>
      </header>

      <div className="container" id="top">
        <section className="page-heading" aria-labelledby="page-title">
          <div>
            <p className="eyebrow"><span /> YOUR PRE-GAME HQ</p>
            <h1 id="page-title">STRATEGY <span>BOARD</span></h1>
            <p className="heading-copy">Keep the callouts, plans, and clutch ideas that win the next round.</p>
          </div>
          <div className="match-status"><span className="status-dot" /> READY TO QUEUE</div>
        </section>

        <section className="workspace" aria-label="Strategy notes workspace">
          <aside className="composer-column">
            <div className="section-kicker"><span>01</span> NEW PLAY</div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-heading">
                <h2>{editingId ? "EDIT PLAY" : "CAPTURE A PLAY"}</h2>
                <span className="form-indicator">{editingId ? "EDITING" : "DRAFT"}</span>
              </div>
              <label htmlFor="note-title">PLAY NAME</label>
              <input
                id="note-title"
                type="text"
                placeholder="e.g. B-site retake setup"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {error && <span className="error" role="alert">{error}</span>}
              <label htmlFor="note-description">DETAILS & CALLOUTS</label>
              <textarea
                id="note-description"
                placeholder="Write the setup, timing, utility, or anything the squad should remember..."
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="form-actions">
                <button className="btn primary" type="submit" disabled={!!error}>
                  <span>{editingId ? "UPDATE PLAY" : "SAVE PLAY"}</span><span aria-hidden="true">↗</span>
                </button>
                {editingId && (
                  <button className="btn cancel" type="button" onClick={resetForm}>CANCEL</button>
                )}
              </div>
              <p className="form-footnote"><span className="status-dot" /> AUTO-SAVED TO THIS DEVICE</p>
            </form>
          </aside>

          <section className="board-column" aria-labelledby="notes-heading">
            <div className="board-title-row">
              <div>
                <div className="section-kicker"><span>02</span> THE PLAYBOOK</div>
                <h2 id="notes-heading">SAVED PLAYS <span className="note-count">{String(notes.length).padStart(2, "0")}</span></h2>
              </div>
              <span className="board-label">ALL NOTES</span>
            </div>
            {notes.length === 0 ? (
              <div className="empty-state">
                <span className="empty-cross" aria-hidden="true">+</span>
                <p className="empty-title">NO PLAYS ON THE BOARD</p>
                <p>Your next big-brain strat starts on the left.</p>
              </div>
            ) : (
              <div className="notes">
                {notes.map((note, index) => (
                  <NoteItem key={note.id} note={note} index={index} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </section>
        </section>
        <footer className="page-footer"><span>LOADOUT / STRATEGY BOARD</span><span>STAY SHARP. PLAY SMART.</span></footer>
      </div>
    </main>
  );
}