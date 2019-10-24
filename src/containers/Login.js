import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import girl from "../assets/girl.jpg";

export default function Login() {
  const goLogin = () => {
    window.location = "http://localhost:5000/login";
  };

  const token = localStorage.getItem("access_token");

  if (token) {
    return <Redirect to="/home" />;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh"
      }}
    >
      <div
        style={{
          width: 500,
          height: 300,
          background: "white",
          borderRadius: 20
        }}
      >
        <Row>
          <Col md={5}>
            <img
              src={girl}
              alt="girl"
              style={{
                height: 300,
                width: 225,
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20
              }}
            />
          </Col>
          <Col
            md={7}
            style={{
              padding: "50px 20px 0 40px",
              background: "#FAFAFA",
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20
            }}
          >
            <h1 style={{ color: "#3F3F3F" }}>Hi there...</h1>
            <p style={{ color: "#929292" }}>
              In order to use <b>Moodesty</b> you should login to spotify first
            </p>
            <Button
              variant="outline-info"
              size="lg"
              style={{ marginTop: 20, borderRadius: 20 }}
              onClick={() => goLogin()}
            >
              <i className="fab fa-spotify"></i> Login with spotify
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
