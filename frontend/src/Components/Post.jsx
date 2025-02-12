const Post = ({ post }) => {
    return (
      <div className="border p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p className="text-gray-600">{post.body}</p>
      </div>
    );
  };
  
  export default Post;
  