import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axiosInstance from "../../Context/axiosInstance";
import { toastError, toastSuccess } from "../utils/toastCustom";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.liked_by_user);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const handleLike = async () => {
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;
    
    try {
      // Optimistically update UI
      setIsLiked(newIsLiked);
      setLikesCount(newLikesCount);
      
      const response = await axiosInstance({
        method: newIsLiked ? 'post' : 'delete',
        url: `/posts/${post.id}/like/`
      });
      
      if (response.status === 200) {
        toastSuccess(newIsLiked ? "Post liked!" : "Post unliked!");
      }
    } catch (error) {
      // Revert UI changes if request fails
      setIsLiked(!newIsLiked);
      setLikesCount(likesCount);
      toastError("Error toggling like!");
      console.error("Error:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 500,
        mx: "auto",
        mt: 2,
        p: 2,
        border: "2px solid #1B6630",
        position: "relative",
        mb: 5,
      }}
    >

      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 40,
          height: 40,
          backgroundColor: post.points_received > 0 ? "#1B6630" : "#bbb",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "50%",
          fontWeight: "bold",
          fontSize: "14px",
          boxShadow: "2px 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        {post.points_received}
      </Box>


      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          src={post.user.profile_picture} // Uses profile picture if available
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#1B6630",
          }}
        />
        <Link 
          to={`/profile/${post.user.id}`}
          style={{ textDecoration: 'none' }}
        >
          <Typography
            variant="h6"
            sx={{ 
              ml: 2, 
              color: "#1B6630", 
              fontWeight: "bold",
              '&:hover': {
                color: '#145022',
                textDecoration: 'underline'
              }
            }}
          >
            {post.user.username}
          </Typography>
        </Link>
      </Box>

            <Typography
              variant="body1"
              sx={{ color: "#1B6630", fontWeight: "bold", mt: 1 }}
            >
              {post.caption}
            </Typography>


      <Box
        sx={{
          backgroundColor: "#DEFDE9",
          borderRadius: 2,
          overflow: "hidden",
          mb: 1,
        }}
      >
        <img
          src={post.image}
          alt="Post"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </Box>

      {/* Like Button and Count */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <IconButton 
          onClick={handleLike}
          sx={{ 
            color: isLiked ? '#1B6630' : 'grey',
            '&:hover': {
              color: isLiked ? '#145022' : '#1B6630',
            }
          }}
        >
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#1B6630',
            fontWeight: 'bold',
            ml: 1 
          }}
        >
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </Typography>
      </Box>

    </Box>
  );
};

export default Post;
