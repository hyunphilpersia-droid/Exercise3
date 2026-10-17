"use client";

export default function NoteItem({ note, index, onEdit, onDelete }) {
  return (
    <div className="note">
      <div className="note-index">{String(index + 1).padStart(2, "0")}</div>
      <div className="note-body">
        <h3>{note.title}</h3>
        <p>{note.description}</p>
      </div>
      <div className="note-actions">
        <button className="btn edit" type="button" onClick={() => onEdit(note)}>EDIT</button>
        <button className="btn delete" type="button" onClick={() => onDelete(note.id)}>DELETE</button>
      </div>
    </div>
  );
}