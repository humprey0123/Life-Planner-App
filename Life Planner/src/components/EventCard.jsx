import'./EventCard.css'
import { useState } from 'react';

function EventCard({ id, image, title, date, location, link, onDelete, onEdit}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editEvent, setEditEvent] = useState({ title, date, location, link, image });

  const handleSave = () => {
    onEdit(id, editEvent);
    setIsEditing(false);
  };


  return (
    <>
      <div className="event-card">
          <img
            src={image}
            alt={title}
            style={{ width: "100%", borderRadius: "6px", marginBottom: "10px", cursor: "pointer" }}
            onClick={() => setIsZoomed(true)}
          />
          <h3>{title}</h3>
          <p>{date}</p>
          <h4>Location: {location}</h4>
          <a href={link} target="_blank" rel="noopener noreferrer">More Info</a>
          <button onClick={() => setIsEditing(true)} style={{ marginRight: '5px' }}>✏️ Edit</button>
          <button onClick={() => onDelete(id)} style={{color: 'red', marginTop:'10px', marginLeft: '5px'}}>Delete</button>
      </div>

        {/* Zoom Modal */}
        {isZoomed && (
          <div
            className="zoom-overlay"
            onClick={() => setIsZoomed(false)}
          >
            <img
              src={image}
              alt="Zoomed"
              style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "12px" }}
            />
          </div>
        )}
           {/* Edit Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Event</h3>
            <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <input
                type="text"
                value={editEvent.title}
                onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                required
              />
              <input
                type="date"
                value={editEvent.date}
                onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
              />
              <input
                type="text"
                value={editEvent.location}
                onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
              />
              <input
                type="url"
                value={editEvent.link}
                onChange={(e) => setEditEvent({ ...editEvent, link: e.target.value })}
              />
              <input
                type="url"
                value={editEvent.image}
                onChange={(e) => setEditEvent({ ...editEvent, image: e.target.value })}
              />
              <div className="modal-buttons">
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default EventCard; 