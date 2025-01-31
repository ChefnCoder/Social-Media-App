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