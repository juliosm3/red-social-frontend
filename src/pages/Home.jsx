import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import CommentSection from '../components/CommentSection';
import './Home.css';

const Home = () => {
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [animatingLikes, setAnimatingLikes] = useState({});
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autenticado.');
        return;
      }

      try {
        const postsRes = await axios.get('/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(postsRes.data);
      } catch (err) {
        console.error('Error al obtener los posts:', err);
        setError('No se pudieron cargar los posts.');
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este post?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.error('Error al eliminar el post:', err);
      setError('No se pudo eliminar el post.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-post/${id}`);
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnimatingLikes((prev) => ({ ...prev, [postId]: true }));

      setPosts((prev) =>
        prev.map((post) => {
          if (post._id === postId) {
            const alreadyLiked = post.likes.includes(userId);
            const updatedLikes = alreadyLiked
              ? post.likes.filter((id) => id !== userId)
              : [...post.likes, userId];
            return { ...post, likes: updatedLikes };
          }
          return post;
        })
      );

      setTimeout(() => {
        setAnimatingLikes((prev) => ({ ...prev, [postId]: false }));
      }, 600);
    } catch (err) {
      console.error('Error al dar/quitar like:', err);
      setError('Hubo un problema al dar/quitar el like.');
    }
  };

  return (
    <div className="home-container">
      <h1>Bienvenido{username ? `, ${username}` : ""}</h1>

      {error && <div className="error-message">{error}</div>}

      {posts.length > 0 ? (
        posts.map((post) => {
          const hasLiked = Array.isArray(post.likes) && post.likes.includes(userId);
          return (
            <div className="post-card" key={post._id}>
              <h3>{post.content}</h3>
              {post.image && (
                <img
                  src={`http://localhost:5000/${post.image}`}
                  alt="post"
                  className="post-image"
                />
              )}

              <div className="post-info">
                <p>Publicado por: {post.userId.username}</p>
                <p>Likes: {post.likes?.length || 0}</p>
              </div>

              <div className="post-actions">
                <button onClick={() => handleEdit(post._id)} className="btn edit-btn">
                  Editar
                </button>
                <button onClick={() => handleDelete(post._id)} className="btn delete-btn">
                  Eliminar
                </button>
                <button
                  onClick={() => handleLike(post._id)}
                  className={`like-button ${hasLiked ? "liked" : ""} ${animatingLikes[post._id] ? "animate" : ""}`}
                >
                  {hasLiked ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>

              <CommentSection postId={post._id} />
            </div>
          );
        })
      ) : (
        <p>No hay publicaciones aún.</p>
      )}

      <div className="create-post-link">
        <Link to="/create-post">Crear un nuevo post</Link>
      </div>
    </div>
  );
};

export default Home;