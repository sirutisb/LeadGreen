import React, { useState, useEffect, forwardRef } from 'react';
import axiosInstance from "../../Context/axiosInstance";
import { ShoppingBag, Clock, ShoppingCart } from 'lucide-react';
import greencoinIcon from '../../assets/peng.svg';
import { toastError, toastSuccess } from "../utils/toastCustom";
import {
  Dialog,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Fade
} from '@mui/material';
import { Add, Remove, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';

// Create a Transition component using Fade with a timeout of 500ms
const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} timeout={500} />;
});

const GardenShop = ({ isOpen, onClose, user, setUser, onPurchase }) => {
  const [animateItems, setAnimateItems] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inventory, setInventory] = useState({});
  const [itemQuantities, setItemQuantities] = useState({});
  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animate items when shop opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setAnimateItems(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setAnimateItems(false);
    }
  }, [isOpen]);

  // Fetch shop items from API
  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/game/items/');
        const data = response.data;

        if (data.success && Array.isArray(data.items)) {
          setShopItems(data.items);
          const initialQuantities = {};
          data.items.forEach((item) => {
            initialQuantities[item.id] = 1;
          });
          setItemQuantities(initialQuantities);
          if (data.points !== undefined) {
            setUser((prevUser) => ({
              ...prevUser,
              coins: data.points,
            }));
          }
        } else {
          setError('Failed to load shop items');
        }
      } catch (err) {
        setError('Error connecting to the shop service');
        console.error('Shop fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchShopItems();
    }
  }, [isOpen, setUser]);

  // Fetch inventory
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axiosInstance.get('/game/inventory/');
        const inventoryData = {};
        response.data.forEach((item) => {
          inventoryData[item.item.id] = item.quantity;
        });
        setInventory(inventoryData);
      } catch (err) {
        console.error('Inventory fetch error:', err);
        toastError('Failed to load inventory');
      }
    };

    if (isOpen && shopItems.length > 0) {
      fetchInventory();
    }
  }, [isOpen, shopItems]);

  // Update item quantity
  const updateItemQuantity = (itemId, change) => {
    setItemQuantities((prev) => {
      const newQuantity = Math.max(1, (prev[itemId] || 1) + change);
      return { ...prev, [itemId]: newQuantity };
    });
  };

  // Handle purchase
  const handlePurchase = async (item) => {
    const quantity = itemQuantities[item.id] || 1;
    const totalPrice = item.price * quantity;

    if (user.coins >= totalPrice) {
      try {
        const response = await axiosInstance.post(`/game/items/${item.id}/purchase/`, {
          quantity: quantity,
        });
        const result = response.data;

        if (result.success) {
          setUser((prevUser) => ({
            ...prevUser,
            coins: result.remaining_points,
          }));
          if (onPurchase) {
            onPurchase();
          }
          toastSuccess(`Successfully purchased ${quantity} ${item.name}!`);
        } else {
          toastError(result.message || 'Purchase failed. Please try again.');
        }
      } catch (err) {
        toastError('Purchase failed. Please try again.');
        console.error('Purchase error:', err);
      }
    } else {
      toastError('Not enough coins!');
    }
  };

  // Handle item selection
  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  // Get item effects display
  const getItemEffectsDisplay = (item) => {
    if (!item.effects || item.effects.length === 0) {
      return 'No special effects';
    }
    return item.effects.map((effect) => effect.name).join(', ');
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition} // Use fade transition for dialog
      keepMounted // Optional: keeps the child component mounted during transitions
    >
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(to right, #34d399, #059669)', // emerald-300 to green-600
            p: 2,
            color: 'white',
          }}
        >
          <ShoppingBag size={24} />
          <Typography variant="h6" sx={{ ml: 1 }}>
            Garden Shop
          </Typography>
        </Box>

        {/* Shop Timer */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#ecfdf5', // emerald-50
            p: 2,
            borderBottom: 1,
            borderColor: 'grey.200',
          }}
        >
          <Typography variant="body1">Featured Items</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Clock size={16} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              23 HOURS
            </Typography>
          </Box>
        </Box>

        {/* Grid Layout */}
        <Box sx={{ p: 2, overflowY: 'auto', flexGrow: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {shopItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Box
                    sx={{
                      transform: animateItems ? 'translateY(0)' : 'translateY(20px)',
                      opacity: animateItems ? 1 : 0,
                      transition: 'transform 0.5s, opacity 0.5s',
                      transitionDelay: `${index * 50}ms`,
                    }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'linear-gradient(to bottom, #f9fafb, #ecfdf5)', // gray-50 to emerald-50
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'scale(1.03)' },
                      }}
                    >
                      <Box sx={{ height: 1, background: 'linear-gradient(to right, #34d399, #059669)' }} />
                      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                        <Box sx={{ position: 'relative', height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                          />
                          {item.item_type === "NEW" && (
                            <Chip label="NEW!" color="primary" size="small" sx={{ position: 'absolute', top: 8, right: 8 }} />
                          )}
                          {item.item_type === "POPULAR" && (
                            <Chip label="POPULAR" color="secondary" size="small" sx={{ position: 'absolute', top: 8, right: 8 }} />
                          )}
                          {inventory[item.id] > 0 && (
                            <Chip label={`Owned: ${inventory[item.id]}`} color="success" size="small" sx={{ position: 'absolute', top: 8, left: 8 }} />
                          )}
                          {item.cooldown_seconds > 0 && (
                            <Chip
                              icon={<Clock size={12} />}
                              label={`${Math.floor(item.cooldown_seconds / 60)}m cooldown`}
                              size="small"
                              sx={{ position: 'absolute', bottom: 8, right: 8 }}
                            />
                          )}
                        </Box>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography variant="body2">{item.description}</Typography>
                        <Typography variant="caption">{getItemEffectsDisplay(item)}</Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton onClick={() => updateItemQuantity(item.id, -1)}>
                            <Remove />
                          </IconButton>
                          <Typography>{itemQuantities[item.id] || 1}</Typography>
                          <IconButton onClick={() => updateItemQuantity(item.id, 1)}>
                            <Add />
                          </IconButton>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handlePurchase(item)}
                          disabled={item.price === 0}
                        >
                          {item.price === 0 ? 'FREE' : 'BUY'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#ecfdf5', // emerald-50
            p: 2,
            borderTop: 1,
            borderColor: 'grey.200',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Your balance:
            </Typography>
            <Typography variant="h6">{user?.coins || 0}</Typography>
            <img src={greencoinIcon} alt="Coins" style={{ width: 24, height: 24, marginLeft: 8 }} />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = '/#lead-points')}
          >
            Get Coins
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

GardenShop.ShopButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      startIcon={<ShoppingCartIcon />}
      sx={{
        borderRadius: 2,
        bgcolor: 'primary.main',
        color: 'white',
        textTransform: 'none',
        '&:hover': {
          bgcolor: 'primary.dark',
        },
        boxShadow: 3,
        px: 3,
        py: 1,
      }}
    >
      Shop
    </Button>
  );
};

export default GardenShop;
