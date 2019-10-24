import React, { Component } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import axios from "axios";
import queryString from "query-string";

let parsed = queryString.parse(window.location.search);

export default class Home extends Component {
  state = {
    playlist: [],
    playlistID: ""
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

  changePlaylist = uri => {
    let data = uri.split(":");
    this.setState({
      playlistID: `https://open.spotify.com/embed/playlist/${data[2]}`
    });
  };

  componentDidMount = async () => {
    await this.getMood();
  };

  render() {
    const { playlist, playlistID } = this.state;
    let abc = `abc`;
    console.log(playlist);
    return (
      <div style={{ minHeight: "100vh" }}>
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
                    variant="outline-info"
                    size="lg"
                    block
                    style={{ borderWidth: 3, borderRadius: 20 }}
                  >
                    <b>Bring the awesome!</b>
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
              {playlistID.length > 0 ? (
                <iframe
                  src={playlistID}
                  width="300"
                  height="380"
                  frameBorder="0"
                  allowtransparency="true"
                  allow="encrypted-media"
                ></iframe>
              ) : (
                <div />
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
