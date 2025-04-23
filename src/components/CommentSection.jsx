import React, { useEffect, useState, useCallback } from 'react';
import axios from '../utils/axiosConfig';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
  }, []);

  const fetchComments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/comments/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data);
    } catch {
      setError('Error al cargar comentarios');
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/comments',
        { postId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      fetchComments();
    } catch {
      setError('Error al enviar el comentario');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch {
      setError('Error al eliminar el comentario');
    }
  };

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setEditingText(comment.text);
  };

  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/comments/${id}`,
        { text: editingText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditingText("");
      fetchComments();
    } catch {
      setError('Error al actualizar el comentario');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div style={{ marginTop: "10px", paddingLeft: "10px" }}>
      <h4>Comentarios</h4>
      {comments.length === 0 ? (
        <p>No hay comentarios aún.</p>
      ) : (
        comments.map((c) => (
          <div key={c._id} style={{ marginBottom: "8px" }}>
            <strong>{c.userId.username}:</strong>{" "}
            {editingId === c._id ? (
              <>
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  style={{ width: "60%", padding: "4px" }}
                />
                <button onClick={() => handleUpdate(c._id)} style={{ marginLeft: "6px" }}>
                  Guardar
                </button>
                <button onClick={handleCancelEdit} style={{ marginLeft: "4px" }}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                {c.text}
                {c.userId._id === userId && (
                  <>
                    <button
                      onClick={() => handleEdit(c)}
                      style={{
                        marginLeft: "10px",
                        background: "#ddd",
                        color: "#333",
                        border: "none",
                        borderRadius: "4px",
                        padding: "2px 8px",
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      style={{
                        marginLeft: "6px",
                        background: "#ccc",
                        color: "#333",
                        border: "none",
                        borderRadius: "4px",
                        padding: "2px 8px",
                        cursor: "pointer",
                      }}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        ))
      )}
      <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Escribe un comentario..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "80%", padding: "5px" }}
        />
        <button type="submit" style={{ padding: "5px 10px", marginLeft: "5px" }}>
          Enviar
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CommentSection;