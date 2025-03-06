import { useState, useEffect } from "react";
import { fetchGameData, performAction } from "../Components/OverLeaf/gameService";
import { toastError, toastSuccess, toastWarning } from "../Components/utils/toastCustom";

export default function useGameData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentInsect, setCurrentInsect] = useState(null);
  const [prevLevel, setPrevLevel] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [scale, setScale] = useState(1);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await fetchGameData();
      
      const updatedUser = {
        points_balance: data.points_balance,
        tree_level: data.tree.level,
        plant_name: data.tree.name,
        plant_image: data.tree.image,
        spins: data.spins_remaining,
        has_insect: !!data.insect,
        insect: data.insect || null,
      };
      
      setUser(updatedUser);
      setScale(1 + data.tree.growth);
      
      if (data.insect) {
        handleInsect(data.insect);
      } else {
        setCurrentInsect(null);
      }

      setPrevLevel(data.tree.level);
      setInitialLoad(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toastError("Failed to load user data!");
    } finally {
      setLoading(false);
    }
  };

  const handleInsect = (insectData) => {
    if (insectData) {
      if (!currentInsect || currentInsect.name !== insectData.name) {
        setCurrentInsect({ name: insectData.name, image: insectData.image || "" });
        return true; // New insect detected
      }
    } else {
      setCurrentInsect(null);
    }
    return false;
  };

  const executeAction = async (action) => {
    try {
      const data = await performAction(action);
      
      if (data.success) {
        setUser(prev => ({
          ...prev,
          points_balance: data.points_balance,
          tree_level: data.tree.level,
          plant_image: data.tree.image, 
          has_insect: !!data.insect,
          insect: data.insect || null
        }));

        setScale(Math.round((1 + data.tree.growth) * 100) / 100);
        
        if (data.insect) {
          handleInsect(data.insect);
        } else {
          setCurrentInsect(null);
        }
        
        return { success: true, data };
      } else {
        toastError(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Action failed";
      toastError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return {
    user,
    setUser,
    loading,
    currentInsect,
    fetchUserData,
    executeAction,
    scale,
    prevLevel,
    initialLoad
  };
}