import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  fetchUsers,
  fetchFriends,
  fetchFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../services/api";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";

const Home = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    if (token) {
      fetchUsers(token).then(setUsers);
      fetchFriends(token).then(setFriends);
      fetchFriendRequests(token).then(setFriendRequests);
    }
  }, [token]);

  // Send friend request
  const handleSendRequest = async (userId) => {
    await sendFriendRequest(token, userId);
    fetchUsers(token).then(setUsers); // Refresh users list
    fetchFriendRequests(token).then(setFriendRequests); // Refresh friend requests
  };

  // Accept friend request
  const handleAcceptRequest = async (userId) => {
    await acceptFriendRequest(token, userId);
    fetchFriends(token).then(setFriends); // Refresh friends list
    fetchFriendRequests(token).then(setFriendRequests); // Refresh requests list
  };

  // Reject friend request
  const handleRejectRequest = async (userId) => {
    await rejectFriendRequest(token, userId);
    fetchFriendRequests(token).then(setFriendRequests); // Refresh requests list
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Welcome, {user?.name}</h2>
        <Button variant="danger" onClick={() => { logout(); }}>
          Logout
        </Button>
      </div>

      <Row className="mt-4">
        {/* Friends List */}
        <Col md={4}>
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

        {/* Friend Requests (Accept/Reject) */}
        <Col md={4}>
          <Card>
            <Card.Header as="h5">Friend Requests</Card.Header>
            <ListGroup variant="flush">
              {friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                  <ListGroup.Item key={request._id}>
                    <strong>{request.name}</strong> (@{request.username})
                    <div className="d-flex justify-content-end mt-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleRejectRequest(request._id)}
                      >
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

        {/* All Users (Send Friend Requests) */}
        <Col md={4}>
          <Card>
            <Card.Header as="h5">All Users</Card.Header>
            <ListGroup variant="flush">
              {users.length > 0 ? (
                users.map((user) => {
                  const isFriend = friends.some((friend) => friend._id === user._id);
                  const isPending = friendRequests.some((req) => req._id === user._id);

                  return (
                    <ListGroup.Item key={user._id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{user.name}</strong> (@{user.username})
                      </div>
                      {isFriend ? (
                        <Button variant="success" size="sm" disabled>
                          Friends
                        </Button>
                      ) : isPending ? (
                        <Button variant="secondary" size="sm" disabled>
                          Pending
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSendRequest(user._id)}
                        >
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
