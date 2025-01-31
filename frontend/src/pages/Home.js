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
} from "../services/api";
import { Container, Row, Col, Card, ListGroup, Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

const Home = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [recommendedFriends, setRecommendedFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set()); // Track sent requests
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMutual, setFilterMutual] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUsers(token).then(setUsers);
      fetchFriends(token).then(setFriends);
      fetchFriendRequests(token).then(setFriendRequests);
      fetchFriendRecommendations(token).then(setRecommendedFriends);
    }
  }, [token]);

  // Send friend request and update UI
  const handleSendRequest = async (userId) => {
    await sendFriendRequest(token, userId);
    setSentRequests((prev) => new Set([...prev, userId])); // Update state to mark request as sent
    fetchUsers(token).then(setUsers);
    fetchFriendRecommendations(token).then(setRecommendedFriends);
    toast.success("Friend request sent!");
  };

  return (
    <Container className="mt-4">
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Welcome, {user?.name}</h2>
        <Button variant="danger" onClick={logout}>Logout</Button>
      </div>

      <Row>
        {/* Friends List */}
        <Col md={3}>
          <Card>
            <Card.Header as="h5">Friends List</Card.Header>
            <ListGroup variant="flush">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <ListGroup.Item key={friend._id}>
                    <strong>{friend.name}</strong> (@{friend.username})
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No friends yet.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        {/* Friend Requests */}
        <Col md={3}>
          <Card>
            <Card.Header as="h5">Friend Requests</Card.Header>
            <ListGroup variant="flush">
              {friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                  <ListGroup.Item key={request._id}>
                    <strong>{request.name}</strong> (@{request.username})
                    <div className="d-flex justify-content-end mt-2">
                      <Button variant="success" size="sm" onClick={() => acceptFriendRequest(token, request._id)}>
                        Accept
                      </Button>
                      <Button variant="danger" size="sm" className="ms-2" onClick={() => rejectFriendRequest(token, request._id)}>
                        Reject
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No friend requests.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        {/* Friend Recommendations */}
        <Col md={3}>
          <Card>
            <Card.Header as="h5">
              Recommended Friends
              <Form.Check
                type="switch"
                id="mutualFilter"
                label="Filter 2+ Mutual Friends"
                className="float-end"
                onChange={(e) => setFilterMutual(e.target.checked)}
              />
            </Card.Header>
            <ListGroup variant="flush">
              {recommendedFriends.length > 0 ? (
                recommendedFriends.map((user) => (
                  <ListGroup.Item key={user._id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{user.name}</strong> (@{user.username})
                      <small className="text-muted"> - {user.mutualFriendsCount} mutual friends</small>
                    </div>
                    {sentRequests.has(user._id) ? (
                      <Button variant="secondary" size="sm" disabled>
                        Pending
                      </Button>
                    ) : (
                      <Button variant="primary" size="sm" onClick={() => handleSendRequest(user._id)}>
                        Add Friend
                      </Button>
                    )}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No recommendations available.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        {/* All Users with Search */}
        <Col md={3}>
          <Card>
            <Card.Header as="h5">
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
              {users.length > 0 ? (
                users.map((user) => {
                  const isFriend = friends.some((friend) => friend._id === user._id);
                  const isPending = sentRequests.has(user._id);

                  return (
                    <ListGroup.Item key={user._id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{user.name}</strong> (@{user.username})
                      </div>
                      {isFriend ? (
                        <Button variant="success" size="sm" disabled> Friends </Button>
                      ) : isPending ? (
                        <Button variant="secondary" size="sm" disabled> Pending </Button>
                      ) : (
                        <Button variant="primary" size="sm" onClick={() => handleSendRequest(user._id)}>
                          Add Friend
                        </Button>
                      )}
                    </ListGroup.Item>
                  );
                })
              ) : (
                <ListGroup.Item>No users found.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
