import'./EventCard.css'

function EventCard({ image, title, date, location, link}) {
  return (
    <div className="event-card">
        <img src={image} alt={title} style={{ width: "100%", borderRadius: "6px", marginBottom: "10px" }}  />
        <h3>{title}</h3>
        <p>{date}</p>
        <h4>Location: {location}</h4>
        <a href={link} target="_blank" rel="noopener noreferrer">More Info</a>
    </div>
  );
}

export default EventCard; 