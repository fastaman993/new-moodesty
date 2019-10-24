import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Spinner,
  Dropdown
} from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";

const parsed = queryString.parse(window.location.search);

export default class Home extends Component {
  state = {
    playlist: [],
    playlistID: "",
    userData: {},
    userImage: "",
    isLoading: false
  };

  getUserData = () => {
    axios
      .get(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      })
      .then(response => {
        this.setState({
          userData: response.data,
          userImage: response.data.images[0].url
        });
      })
      .catch(err => {
        console.log(`error occurs ${err}`);
      });
  };

  getMood = () => {
    axios
      .get(
        `https://api.spotify.com/v1/browse/categories/mood/playlists?limit=6`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        }
      )
      .then(response => {
        this.setState({
          playlist: response.data.playlists.items
        });
      })
      .catch(err => {
        console.log(`error occurs ${err}`);
      });
  };

  getRandom = async () => {
    await this.setState({
      isLoading: true
    });

    let randomize = Math.round(
      Math.random() * (this.state.playlist.length - 1) + 0
    );
    let uri = this.state.playlist[randomize].uri;
    let data = uri.split(":");

    await this.setState({
      playlistID: `https://open.spotify.com/embed/playlist/${data[2]}`
    });
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 1000);
  };

  changePlaylist = async uri => {
    await this.setState({
      isLoading: true
    });
    let data = uri.split(":");
    await this.setState({
      playlistID: `https://open.spotify.com/embed/playlist/${data[2]}`
    });
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 1000);
  };

  onLogout = () => {
    localStorage.clear();
    this.props.history.push("/");
  };

  setToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      localStorage.setItem("access_token", parsed.access_token);
    }
  };

  componentDidMount = async () => {
    await this.setToken();
    await this.getUserData();
    await this.getMood();
  };

  render() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return <Redirect to="/" />;
    }

    const { playlist, playlistID, userData, userImage, isLoading } = this.state;

    return (
      <div
        style={{
          minHeight: "100vh"
        }}
      >
        <Container>
          <Row>
            <Col md={9} style={{ marginTop: "15vh" }}>
              <h1 style={{ color: "#FFF" }}>Home</h1>
            </Col>
            <Col md={3}>
              <div
                style={{
                  marginTop: "15vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Row>
                  <Col sm={3}>
                    <img
                      src={userImage}
                      alt="profile"
                      style={{ width: 50, height: 50, borderRadius: 50 }}
                    />
                  </Col>
                  <Col sm={7}>
                    <Dropdown style={{ marginTop: 7 }}>
                      <Dropdown.Toggle
                        variant="outline-light"
                        id="dropdown-basic"
                        style={{ borderRadius: 20, color: "#2C3E50" }}
                      >
                        {userData.display_name}
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ borderRadius: 20 }}>
                        <Dropdown.Item onClick={() => this.onLogout()}>
                          Logout
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Row>
                <Col sm={12}>
                  {isLoading ? (
                    <Button
                      variant="light"
                      size="lg"
                      block
                      disabled
                      style={{ borderWidth: 3, borderRadius: 20 }}
                    >
                      <b>
                        Bring the awesome! <i className="fas fa-random"></i>
                      </b>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => this.getRandom()}
                      variant="light"
                      size="lg"
                      block
                      style={{ borderWidth: 3, borderRadius: 20 }}
                    >
                      <b>
                        Bring the awesome! <i className="fas fa-random"></i>
                      </b>
                    </Button>
                  )}
                </Col>

                {playlist.map((item, index) => (
                  <Col key={index} sm={4}>
                    {isLoading ? (
                      <Card
                        style={{
                          background: "transparent",
                          paddingTop: 15,
                          borderWidth: 0
                        }}
                      >
                        <Card.Img
                          variant="top"
                          src={item.images[0].url}
                          style={{
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20
                          }}
                        />
                        <Card.Title
                          style={{
                            fontSize: 18,
                            textAlign: "center",
                            marginTop: 10,
                            fontWeight: "bold",
                            color: "#FFF"
                          }}
                        >
                          {item.name}
                        </Card.Title>
                      </Card>
                    ) : (
                      <Card
                        onClick={() => this.changePlaylist(item.uri)}
                        style={{
                          background: "transparent",
                          paddingTop: 15,
                          borderWidth: 0
                        }}
                      >
                        <Card.Img
                          variant="top"
                          src={item.images[0].url}
                          style={{
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20
                          }}
                        />
                        <Card.Title
                          style={{
                            fontSize: 18,
                            textAlign: "center",
                            marginTop: 10,
                            fontWeight: "bold",
                            color: "#FFF"
                          }}
                        >
                          {item.name}
                        </Card.Title>
                      </Card>
                    )}
                  </Col>
                ))}
              </Row>
            </Col>
            <Col md={4}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {playlistID.length > 0 ? (
                  isLoading ? (
                    <Spinner
                      animation="border"
                      variant="light"
                      size="lg"
                      style={{ marginTop: 100 }}
                    />
                  ) : (
                    <iframe
                      src={playlistID}
                      title="spotify"
                      width="auto"
                      height="380"
                      frameBorder="0"
                      allowtransparency="true"
                      allow="encrypted-media"
                      style={{ borderRadius: 20 }}
                    ></iframe>
                  )
                ) : (
                  <div />
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
