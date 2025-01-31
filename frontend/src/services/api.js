const API_BASE_URL = process.env.REACT_APP_API_URL;


// Register a new user
export const registerUser = async (name, username, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, username, email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    return { error: "Registration failed" };
  }
};

// Login an existing user
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error logging in:", error);
    return { error: "Login failed" };
  }
};



// Fetching all users except logged-in user
export const fetchUsers = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Fetch the logged-in user's friends list
export const fetchFriends = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/friends`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching friends:", error);
    return [];
  }
};


// Send a friend request
export const sendFriendRequest = async (token, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/friends/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error sending friend request:", error);
  }
};

// Accept a friend request
export const acceptFriendRequest = async (token, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/friends/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error accepting friend request:", error);
  }
};

// Reject a friend request
export const rejectFriendRequest = async (token, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/friends/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error rejecting friend request:", error);
  }
};

// Fetch pending friend requests
export const fetchFriendRequests = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/friends/requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return [];
  }
};


// Fetch friend recommendations based on mutual friends
export const fetchFriendRecommendations = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching friend recommendations:", error);
    return [];
  }
};

export const unfriendUser = async (token, userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/friends/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error removing friend:", error);
      return { error: "Failed to remove friend" };
    }
  };
  
