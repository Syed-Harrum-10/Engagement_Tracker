import { useRef } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "./api";

type Image = { id: number; url: string; category: string };

function ImageCard({ img }: { img: Image }) {
  const startTime = useRef<number | null>(null);
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleEnter = () => {
    startTime.current = Date.now();
  };

  const handleLeave = async () => {
    if (startTime.current === null) return;
    const seconds = Math.floor((Date.now() - startTime.current) / 1000);
    startTime.current = null;
    if (seconds < 5) return;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!token || !user) return;

    const res = await fetch(apiUrl("/api/events"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user.id,
        imageId: img.id,
        dwellSeconds: seconds,
      }),
    });
    console.log("event", await res.json());
  };

  return (
    <article className="image-card" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <div className="image-card-media">
        <img src={img.url} alt={img.category} loading="lazy" />
        <span className="image-card-category">{img.category}</span>
        <div className="image-card-hint">
          {isLoggedIn ? (
            <span>Stay for 5 seconds to show interest</span>
          ) : (
            <span><Link to="/login">Log in</Link> to build your interests</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ImageCard;