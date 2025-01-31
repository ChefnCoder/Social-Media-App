import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchUsers, fetchFriends } from "../services/api";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";

const Home = () => {
  const { user, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (token) {
      fetchUsers(token).then(setUsers);
      fetchFriends(token).then(setFriends);
    }
  }, [token]);

  return (
    <Container className="mt-4">
      <h2 className="text-center">Welcome, {user?.name}</h2>

      <Row className="mt-4">
        {/* Friends List */}
        <Col md={6}>
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

        {/* All Users */}
        <Col md={6}>
          <Card>
            <Card.Header as="h5">All Users</Card.Header>
            <ListGroup variant="flush">
              {users.length > 0 ? (
                users.map((user) => (
                  <ListGroup.Item key={user._id}>
                    <strong>{user.name}</strong> (@{user.username})
                  </ListGroup.Item>
                ))
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
