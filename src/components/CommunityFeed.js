import React, { useState, useEffect } from 'react';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import communityApi from '../api/communityService';
import '../components/css/CommunityFeed.css';

const CommunityFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(2); // số post mỗi trang
  const [totalPages, setTotalPages] = useState(0);

  const fetchPosts = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const response = await communityApi.fetchPosts(pageNumber, size);
      setPosts(response.content);
      setTotalPages(response.totalPages);
      setPage(pageNumber);
    } catch (error) {
      console.error('Lỗi khi tải bài đăng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(0);
  }, []);

  if (loading) {
    return <div className="feed-container">Đang tải...</div>;
  }

  return (
    <div className="feed-container" style={{ paddingTop: '150px' }}>
      {/* Có thể để CreatePost nếu muốn ai cũng tạo bài được */}
      <CreatePost onPostCreated={() => fetchPosts(page)} />

      <div className="post-feed">
        {posts.length > 0 ? (
          posts.map(post => (
            <Post key={post.id} post={post} />
          ))
        ) : (
          <p>Chưa có bài đăng nào. Hãy là người đầu tiên chia sẻ!</p>
        )}
      </div>

      <div className="pagination">
        <button onClick={() => fetchPosts(page - 1)} disabled={page === 0}>Trang trước</button>
        <span> {page + 1} / {totalPages} </span>
        <button onClick={() => fetchPosts(page + 1)} disabled={page + 1 >= totalPages}>Trang sau</button>
      </div>
    </div>
  );
};

export default CommunityFeed;
