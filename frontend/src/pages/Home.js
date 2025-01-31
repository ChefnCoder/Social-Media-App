import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  fetchUsers,
  fetchFriends,
  fetchFriendRequests,
  fetchFriendRecommendations,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriendUser,
} from "../services/api";
import { Container, Row, Col, Card, ListGroup, Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

const Home = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [recommendedFriends, setRecommendedFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (token) {
      fetchUsers(token).then(setUsers);
      fetchFriends(token).then(setFriends);
      fetchFriendRequests(token).then(setFriendRequests);
      fetchFriendRecommendations(token).then(setRecommendedFriends);
    }

    // Poll for new friend requests every 5 seconds
    const interval = setInterval(() => {
      fetchFriendRequests(token).then(setFriendRequests);
      fetchFriends(token).then(setFriends);
      fetchFriendRecommendations(token).then(setRecommendedFriends);
      
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [token]);

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Send friend request and update UI
  const handleSendRequest = async (userId) => {
    await sendFriendRequest(token, userId);
    setSentRequests((prev) => new Set([...prev, userId])); // Mark request as sent
    fetchUsers(token).then(setUsers);
    fetchFriendRecommendations(token).then(setRecommendedFriends);
    toast.success("Friend request sent!");
  };

  // Accept friend request
  const handleAcceptRequest = async (userId) => {
    await acceptFriendRequest(token, userId);
    fetchFriends(token).then(setFriends);
    fetchFriendRequests(token).then(setFriendRequests);
    toast.success("Friend request accepted!");
  };

  // Reject friend request
  const handleRejectRequest = async (userId) => {
    await rejectFriendRequest(token, userId);
    fetchFriendRequests(token).then(setFriendRequests);
    toast.info("Friend request rejected.");
  };

  // Unfriend a user
  const handleUnfriend = async (userId) => {
    const response = await unfriendUser(token, userId);
    if (response.message) {
      fetchFriends(token).then(setFriends);
      toast.success("Friend removed successfully!");
    } else {
      toast.error("Failed to remove friend.");
    }
  };

  return (
    <Container className="mt-4">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="d-flex justify-content-between align-items-center mb-4 p-3 border rounded shadow-sm">
        <h2 className="fw-bold">Welcome, {user?.name}</h2>
        <Button variant="danger" className="rounded-pill px-4" onClick={logout}>
          Logout
        </Button>
      </div>

      <Row className="g-4">
        {/* Friends List */}
        <Col md={4}>
          <Card className="shadow">
            <Card.Header as="h5" className="fw-bold text-center bg-primary text-white">Friends List</Card.Header>
            <ListGroup variant="flush">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <ListGroup.Item key={friend._id} className="d-flex justify-content-between align-items-center p-3">
                    <strong>{friend.name}</strong> (@{friend.username})
                    <Button
                      variant="danger"
                      size="sm"
                      className="rounded-pill"
                      onClick={() => handleUnfriend(friend._id)}
                    >
                      Unfriend
                    </Button>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center text-muted">No friends yet.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        {/* Friend Requests & Recommended Friends (Stacked) */}
        <Col md={4}>
          {/* Friend Requests */}
          <Card className="shadow mb-5">
            <Card.Header as="h5" className="fw-bold text-center bg-warning text-dark">Friend Requests</Card.Header>
            <ListGroup variant="flush">
              {friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                  <ListGroup.Item key={request._id} className="d-flex flex-column align-items-center p-2 mb-2">
                    <div>
                      <strong>{request.name}</strong> (@{request.username})
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <Button variant="success" size="sm" className="me-2 rounded-pill" onClick={() => handleAcceptRequest(request._id)}>
                        Accept
                      </Button>
                      <Button variant="danger" size="sm" className="rounded-pill" onClick={() => handleRejectRequest(request._id)}>
                        Reject
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center text-muted">No friend requests.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>

          {/* Friend Recommendations */}
          <Card className="shadow">
            <Card.Header as="h5" className="fw-bold text-center bg-info text-dark">
              Mutual Friends
            </Card.Header>
            <ListGroup variant="flush">
              {recommendedFriends.length > 0 ? (
                recommendedFriends.map((user) => (
                  <ListGroup.Item key={user._id} className="d-flex justify-content-between align-items-center p-2 mb-2">
                    <div>
                      <strong>{user.name}</strong> (@{user.username})
                      <small className="text-muted"> - {user.mutualFriendsCount} mutual friends</small>
                    </div>
                    <Button
                      variant={sentRequests.has(user._id) ? "secondary" : "primary"}
                      size="sm"
                      className="rounded-pill"
                      disabled={sentRequests.has(user._id)}
                      onClick={() => handleSendRequest(user._id)}
                    >
                      {sentRequests.has(user._id) ? "Pending" : "Add Friend"}
                    </Button>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center text-muted">No recommendations available.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
          
        </Col>

        {/* All Users with Search */}
        <Col md={4}>
          <Card className="shadow">
            <Card.Header as="h5" className="fw-bold text-center bg-secondary text-white">
              All Users
              <Form.Control
                type="text"
                placeholder="Search users..."
                className="mt-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Card.Header>
            <ListGroup variant="flush">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isFriend = friends.some((friend) => friend._id === user._id);
                  const isPending = sentRequests.has(user._id);

                  return (
                    <ListGroup.Item key={user._id} className="d-flex justify-content-between align-items-center p-2 mb-2">
                      <div>
                        <strong>{user.name}</strong> (@{user.username})
                      </div>
                      <Button
                        variant={isFriend ? "success" : isPending ? "secondary" : "primary"}
                        size="sm"
                        className="rounded-pill"
                        disabled={isFriend || isPending}
                        onClick={() => handleSendRequest(user._id)}
                      >
                        {isFriend ? "Friends" : isPending ? "Pending" : "Add Friend"}
                      </Button>
                    </ListGroup.Item>
                  );
                })
              ) : (
                <ListGroup.Item className="text-center text-muted">No users found.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

      </Row>
    </Container>
  );
};

export default Home;
