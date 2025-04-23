import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import '../assets/styles/UserPage.css';
import { FaCamera } from 'react-icons/fa';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/user/me');
        setUser(res.data.user);
        setPosts(res.data.posts);
        setComments(res.data.comments);

        if (res.data.user.following.includes(res.data.user._id)) {
          setIsFollowing(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileImageChange = (e) => {
    setNewProfileImage(e.target.files[0]);
  };

  const handleProfileImageUpload = async () => {
    const formData = new FormData();
    formData.append('image', newProfileImage);

    try {
      const res = await axios.post('/user/upload-profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(res.data.message);
      setUser((prevUser) => ({ ...prevUser, profileImage: res.data.profileImage }));
    } catch (err) {
      console.error(err);
      alert('Error al subir la foto de perfil.');
    }
  };

  const handleFollow = async (userId) => {
    try {
      const res = await axios.post(`/user/follow/${userId}`);
      alert(res.data.message);
      setIsFollowing(true);
    } catch (err) {
      console.error(err);
      alert('Error al seguir al usuario.');
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const res = await axios.post(`/user/unfollow/${userId}`);
      alert(res.data.message);
      setIsFollowing(false);
    } catch (err) {
      console.error(err);
      alert('Error al dejar de seguir al usuario.');
    }
  };

  return (
    <div className="user-page-container">
      <h1>Mi Perfil</h1>
      {user && (
        <div>
          <div className="profile-info">
            <div className="profile-image-wrapper">
              <img src={`http://localhost:5000${user.profileImage}`} alt="Perfil" className="profile-image" />
              <label htmlFor="file-input" className="edit-icon">
                <FaCamera />
              </label>
              <input
                id="file-input"
                type="file"
                onChange={handleProfileImageChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
            <button onClick={handleProfileImageUpload}>Actualizar Foto</button>

            <h2>{user.username}</h2>
            <div className="follow-stats">
              <p><strong>Seguidores:</strong> {user.followers?.length || 0}</p>
              <p><strong>Siguiendo:</strong> {user.following?.length || 0}</p>
            </div>
          </div>

          <div className="posts-section">
            <h3>Mis Posts</h3>
            {posts.length === 0 ? (
              <p>No has publicado nada aún.</p>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="post">
                  <h4>{post.title}</h4>
                  <p>{post.content}</p>
                </div>
              ))
            )}
          </div>

          <div className="comments-section">
            <h3>Mis Comentarios</h3>
            {comments.length === 0 ? (
              <p>No has comentado nada aún.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <strong>{comment.userId.username}</strong>: {comment.text}
                </div>
              ))
            )}
          </div>

          {user._id !== user._id && (
            <div className="follow-section">
              <h3>Seguir a otros usuarios</h3>
              {isFollowing ? (
                <button onClick={() => handleUnfollow(user._id)}>Dejar de seguir</button>
              ) : (
                <button onClick={() => handleFollow(user._id)}>Seguir</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPage;