import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        setContent(response.data.content);

      } catch (err) {
        console.error('Error al cargar el post:', err);
        setError('No se pudo cargar el post para editar.');
      }
      
    };

    fetchPost();
  }, [id]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado.');
      return;
    }

    try {
      await axios.put(`/posts/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      navigate('/home');
    } catch (err) {
      console.error('Error al actualizar el post:', err);
      setError('Hubo un problema al actualizar el post.');
    }
  };

  return (
    <div>
      <h1>Editar Post</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="content">Contenido del post:</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Imagen (opcional):</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
};

export default EditPost;