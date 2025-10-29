import React, { useState, useEffect } from 'react';
import PostFooter from './PostFooter';
import CommentList from './CommentList';
import communityApi from '../api/communityService';
import '../components/css/Post.css';

const Post = ({ post, currentUserId }) => {
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  // Lấy số lượt like
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await communityApi.countLikes(post.id);
        setLikesCount(response.data);
      } catch (error) {
        console.error('Lỗi đếm like:', error);
      }
    };
    fetchLikes();
  }, [post.id]);

  // Toggle Like
  const handleToggleLike = async () => {
    try {
      await communityApi.toggleLike(post.id, currentUserId);
      const response = await communityApi.countLikes(post.id);
      setLikesCount(response.data);
    } catch (error) {
      console.error('Lỗi toggle like:', error);
    }
  };

  // Toggle hiển thị comments
  const handleToggleComments = async () => {
    if (!showComments) {
      try {
        const response = await communityApi.getCommentsByPost(post.id);
        setComments(response.data);
      } catch (error) {
        console.error('Lỗi tải bình luận:', error);
      }
    }
    setShowComments(!showComments);
  };

  // Cập nhật danh sách comment mới
  const handleCommentAdded = (latestComments) => {
    setComments(latestComments);
  };

  return (
    <div className="post-container">
      {/* Header */}
      <div className="post-header">
        <img src={post.avatar} alt="Avatar" className="post-avatar" />
        <div className="post-info">
          <span className="post-user-name">{post.username}</span>
          <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Nội dung post */}
      <div className="post-content">
        <p>{post.content}</p>
        {post.image && <img src={post.image} alt="Post media" className="post-image" />}
      </div>

      {/* Thống kê */}
      <div className="post-stats">
        <span>❤️ {likesCount} Likes</span>
        <span>💬 {post.comments || 0} Comments</span>
      </div>

      {/* Footer: Like & Comment */}
      <PostFooter 
        onLike={handleToggleLike}
        onCommentClick={handleToggleComments}
        isLiked={false} 
      />

      {/* Comment List */}
      {showComments && (
        <CommentList 
          postId={post.id} 
          comments={comments} 
          currentUserId={currentUserId}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
};

export default Post;
