import { useEffect, useState } from "react";
import ImageCard from "./ImageCard";
import { apiUrl } from "./api";
import { Link } from "react-router-dom";

type Image = {
  id: number;
  url: string;
  category: string;
};

function Home() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(apiUrl("/api/images"))
      .then((res) => {
        if (!res.ok) throw new Error("We couldn't load the collection.");
        return res.json();
      })
      .then((data: Image[]) => setImages(data))
      .catch(() => setError("We couldn't load the collection. Please try again in a moment."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-content">
      <section className="page-heading">
        <div>
          <p className="eyebrow">A little inspiration, every day</p>
          <h1>Find your next<br />favorite thing.</h1>
          <p className="page-description">
            Explore a thoughtful collection of ideas and moments picked for you.
          </p>
          <p className="interest-tip">
            Hover over an image for 5 seconds to show your interest.
            {!localStorage.getItem("token") && <> <Link to="/login">Log in</Link> to save it to your profile.</>}
          </p>
        </div>
      </section>
      <section className="gallery-grid" aria-label="Discover images">
        {loading ? (
          <div className="empty-state" role="status">Loading your collection...</div>
        ) : error ? (
          <div className="empty-state" role="alert">{error}</div>
        ) : images.length ? (
          images.map((img) => <ImageCard key={img.id} img={img} />)
        ) : (
          <div className="empty-state">
            <div>
              <strong>Your collection is getting ready</strong>
              New images will show up here when they are available.
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;