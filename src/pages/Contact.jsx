import { useState, useEffect, useRef } from "react";
import CommentForm from "../components/CommentForm";
import DOMPurify from "dompurify";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = "6LdinVUrAAAAAOQGBfKLU5B3SpY5y0TZ5HM486YU"; 

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [comments, setComments] = useState([]);
  const recaptchaRef = useRef(null);

  // download comments on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/comments")
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Erreur de chargement :", err));
  }, []);

  // preview photo
  useEffect(() => {
    if (!photo) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = recaptchaRef.current.getValue();
    if (!token) {
      alert("Veuillez vérifier le reCAPTCHA");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("message", formData.message);
    data.append("token", token);
    if (photo) data.append("photo", photo);

    const res = await fetch("http://localhost:5000/api/comments", {
      method: "POST",
      body: data,
    });

    recaptchaRef.current.reset(); // reset reCAPTCHA

    if (res.ok) {
      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setFormData({ name: "", message: "" });
      setPhoto(null);
      setPreview(null);
    } else {
      alert("Erreur lors de l'envoi");
    }
  };

  // Likes
  const handleLike = async (id) => {
    const res = await fetch(`http://localhost:5000/api/comments/${id}/like`, {
      method: "PUT",
    });

    if (res.ok) {
      const updated = await res.json();
      setComments((prev) =>
        prev.map((comment) => (comment._id === id ? updated : comment))
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Laisser un commentaire</h2>

      <CommentForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        setPhoto={setPhoto}
      />

      <div className="mt-4">
        <ReCAPTCHA
          sitekey={SITE_KEY}
          ref={recaptchaRef}
        />
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">Aperçu de la photo :</p>
          <img src={preview} alt="preview" className="w-40 rounded shadow" />
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Commentaires</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="border-t pt-2 mt-2 space-y-1 bg-gray-50 p-3 rounded"
            >
              <p className="font-bold">{comment.name}</p>
              <div
                className="text-gray-800"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(comment.message),
                }}
              ></div>
              {comment.photoUrl && (
                <img
                  src={`http://localhost:5000${comment.photoUrl}`}
                  alt="Photo du commentaire"
                  className="w-32 h-auto mt-2 rounded"
                />
              )}
              <button
                onClick={() => handleLike(comment._id)}
                className="text-sm text-blue-600 hover:underline"
              >
                ❤️ {comment.likes || 0}
              </button>
            </div>
          ))
        ) : (
          <p>Aucun commentaire pour le moment.</p>
        )}
      </div>
    </div>
  );
}
