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
  const [leveledUp, setLeveledUp] = useState(false);
  const [oldPlantName, setOldPlantName] = useState("");

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await fetchGameData();
      
      // Store previous level info before updating
      setPrevLevel(user?.current_plant?.level || data.current_plant.level);
      
      // Check for level up, but don't trigger effects here
      if (!initialLoad && user && data.current_plant.level > user.current_plant.level) {
        setLeveledUp(true);
        setOldPlantName(user.current_plant.name);
      }
      
      setUser(data);
      setScale(1 + data.tree_growth);
      
      if (data.current_insect) {
        handleInsect(data.current_insect);
      } else {
        setCurrentInsect(null);
      }

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
      // Only update state if it's a new insect or we didn't have one before
      if (!currentInsect || currentInsect.name !== insectData.name) {
        setCurrentInsect({ name: insectData.name, image: insectData.image || "" });
        return true; // New insect detected
      }
      return false; // Same insect, no update needed
    } else if (currentInsect) {
      // Only clear if we actually had an insect
      setCurrentInsect(null);
      return true; // Insect was removed
    }
    return false; // No change in insect state
  };

  const executeAction = async (action) => {
    try {
      const data = await performAction(action);
      
      if (data.success) {
        // Check for level up before updating the state
        if (user && data.current_plant.level > user.current_plant.level) {
          setLeveledUp(true);
          setOldPlantName(user.current_plant.name);
        }
        
        setUser(prev => ({
          ...prev,
          points_balance: data.points_balance,
          current_plant: data.current_plant,
          current_insect: data.current_insect || null,
          spins: data.spins
        }));

        setScale(Math.round((1 + data.tree_growth) * 100) / 100);
        
        if (data.current_insect) {
          handleInsect(data.current_insect);
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
    initialLoad,
    leveledUp,
    setLeveledUp,
    oldPlantName
  };
}