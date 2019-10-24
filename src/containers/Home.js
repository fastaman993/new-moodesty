import React, { Component } from "react";
import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import queryString from "query-string";

let parsed = queryString.parse(window.location.search);

export default class Home extends Component {
  state = {
    playlist: [],
    playlistID: "",
    userData: {},
    isLoading: true
  };

  getUserData = () => {
    axios
      .get(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${parsed.access_token}`
        }
      })
      .then(response => {
        this.setState({
          userData: response
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
            Authorization: `Bearer ${parsed.access_token}`
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

  componentDidMount = async () => {
    await this.getUserData();
    await this.getMood();
  };

  render() {
    const { playlist, playlistID, isLoading } = this.state;
    return (
      <div
        style={{
          minHeight: "100vh"
        }}
      >
        <Container>
          <Row>
            <Col md={12} style={{ marginTop: "15vh" }}>
              <h1 style={{ color: "#FFF" }}>Home</h1>
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Row>
                <Col sm={12}>
                  <Button
                    variant="outline-light"
                    size="lg"
                    block
                    style={{ borderWidth: 3, borderRadius: 20 }}
                  >
                    <b>
                      Bring the awesome! <i class="fas fa-random"></i>
                    </b>
                  </Button>
                </Col>

                {playlist.map((item, index) => (
                  <Col key={index} sm={4}>
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
                  </Col>
                ))}
              </Row>
            </Col>
            <Col md={4}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {playlistID.length > 0 ? (
                  isLoading === true ? (
                    <Spinner
                      animation="border"
                      variant="light"
                      size="lg"
                      style={{ marginTop: 100 }}
                    />
                  ) : (
                    <iframe
                      src={playlistID}
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
