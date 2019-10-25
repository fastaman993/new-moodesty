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
import InfiniteScroll from "react-infinite-scroll-component";

const parsed = queryString.parse(window.location.search);

export default class Home extends Component {
  state = {
    playlist: [],
    playlistID: "",
    errorMsg: "",
    userName: "",
    userImage: "",
    limit: 9,
    offset: 0,
    total: 0,
    hasMore: true,
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
          userName: response.data.display_name
        });
        if (response.data.images.length > 0) {
          this.setState({
            userImage: response.data.images[0].url
          });
        } else {
          this.setState({
            userImage: `https://lejeunefoundation.org/wp-content/uploads/2017/06/male.jpg`
          });
        }
      })
      .catch(err => {
        console.log(`error occurs: ${err}`);
      });
  };

  getMood = () => {
    axios
      .get(
        `https://api.spotify.com/v1/browse/categories/mood/playlists?offset=${this.state.offset}&limit=${this.state.limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        }
      )
      .then(response => {
        this.setState({
          playlist: [...this.state.playlist, ...response.data.playlists.items],
          offset: this.state.offset + 9,
          total: response.data.playlists.total
        });
      })
      .catch(err => {
        console.log(`error occurs: ${err}`);
      });
  };

  getMoodMore = () => {
    axios
      .get(
        `https://api.spotify.com/v1/browse/categories/mood/playlists?offset=${this.state.offset}&limit=${this.state.limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        }
      )
      .then(response => {
        if (this.state.playlist.length >= this.state.total) {
          this.setState({ hasMore: false });
          return;
        }

        setTimeout(() => {
          this.setState({
            playlist: [
              ...this.state.playlist,
              ...response.data.playlists.items
            ],
            offset: this.state.offset + 9
          });
        }, 1500);
      })
      .catch(err => {
        console.log(`error occurs: ${err}`);
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

  onLogout = async () => {
    await localStorage.clear();
    this.props.history.push("/");
    window.location.reload();
  };

  setToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token && parsed.access_token !== undefined) {
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

    const {
      playlist,
      playlistID,
      userName,
      userImage,
      isLoading,
      hasMore
    } = this.state;

    return (
      <div
        style={{
          minHeight: "100vh"
        }}
      >
        <Container>
          <Row>
            <Col md={8} style={{ marginTop: "8vh" }}>
              <h1 style={{ color: "#FFF" }}>Home</h1>
            </Col>
            <Col md={4}>
              <div
                style={{
                  marginTop: "8vh",
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
                        {userName}
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ borderRadius: 20 }}>
                        <Dropdown.Item
                          style={{ borderRadius: 20 }}
                          onClick={() => this.onLogout()}
                        >
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
              </Row>
              <InfiniteScroll
                style={{ marginTop: 15, borderRadius: 20 }}
                dataLength={playlist.length}
                next={this.getMoodMore}
                hasMore={hasMore}
                loader={<Spinner animation="grow" variant="light" />}
                height={550}
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
              >
                <Row style={{ maxWidth: "61vw" }}>
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
              </InfiniteScroll>
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
