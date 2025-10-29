const communityApi = {
  // Lấy bài đăng từ JSON
  fetchPosts: async (pageNumber = 0, size = 5) => {
    try {
      const res = await fetch("/data/posts.json");
      if (!res.ok) throw new Error("Không tải được file JSON.");
      const allPosts = await res.json();

      // Phân trang
      const start = pageNumber * size;
      const pagedPosts = allPosts.slice(start, start + size);
      return {
        content: pagedPosts,
        totalPages: Math.ceil(allPosts.length / size)
      };
    } catch (error) {
      console.error("Lỗi khi tải bài đăng:", error);
      return { content: [], totalPages: 0 };
    }
  }
};

export default communityApi;
