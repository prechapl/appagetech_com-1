import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Carousel from "react-bootstrap/Carousel";

const screenShotAnimation = [
  "images/berlandAnimations/ScreenShots_Berland_700-1.png",
  "images/berlandAnimations/ScreenShots_Berland_700-2.png",
  "images/berlandAnimations/ScreenShots_Berland_700-3.png",
  "images/berlandAnimations/ScreenShots_Berland_700-4.png",
  "images/berlandAnimations/ScreenShots_Berland_700-5.png",
  "images/berlandAnimations/ScreenShots_Berland_700-6.png",
  "images/berlandAnimations/ScreenShots_Berland_700-7.png"
];
const iphoneAnimation = [
  "images/berlandAnimations/IphoneBerland_smart-w300-20.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-19.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-18.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-17.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-16.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-15.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-14.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-13.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-12.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-11.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-10.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-9.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-8.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-7.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-6.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-5.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-4.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-3.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-2.png",
  "images/berlandAnimations/IphoneBerland_smart-w300-1.png"
];

class About extends Component {
  constructor() {
    super();
    this.state = { isVisible: false };
  }
  componentDidMount() {
    this.setState({ isVisible: true });
  }

  onHide() {
    this.setState({ isVisible: false });
  }

  render() {
    const windowAspect = window.innerWidth / window.innerHeight;
    const { isVisible } = this.state;
    return isVisible ? (
      <Modal onHide={this.onHide} size="xl">
        <Modal.Header
          style={{
            border: "1px solid #575757",
            backgroundColor: "black",
            color: "white",
            padding: 0,
            margin: 0
          }}
          closeButton
        >
          <Container style={{ alignItems: "center", marginBottom: 20, padding: 0 }}>
            <Row style={{ justifyContent: "center" }}>
              <Col md={4} sm={12}>
                <Row style={{ justifyContent: "center" }}>
                  <Modal.Title
                    as={"h1"}
                    style={{
                      fontFamily: "co-headline, sans-serif",
                      fontWeight: 700,
                      fontStyle: "normal",
                      marginTop: 3
                    }}
                  >
                    App Age
                  </Modal.Title>
                </Row>
              </Col>
              <Col style={{ padding: 0, marginBottom: 0, marginTop: 0 }}>
                <Modal.Title
                  as={"h4"}
                  style={{
                    fontFamily: "mrs-eaves-xl-serif, serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                    marginTop: 12,
                    marginLeft: "auto",
                    marginRight: "auto"
                  }}
                >
                  <a
                    href="https://toddberland.com"
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{
                      textDecoration: "none",
                      color: "white"
                    }}
                  >
                    toddberland.com
                  </a>
                </Modal.Title>
              </Col>
              <Col style={{ padding: 0, marginBottom: 0, marginTop: 0 }}>
                <Modal.Title
                  as={"p"}
                  style={{
                    fontFamily: "co-text, sans-serif",
                    fontWeight: 300,
                    fontStyle: "normal",
                    fontSize: 12,
                    marginTop: 12,
                    marginLeft: "auto",
                    marginRight: "auto",
                    ailgnItems: "center"
                  }}
                >
                  Launched August 2019
                </Modal.Title>
              </Col>
            </Row>
          </Container>
        </Modal.Header>
        <Modal.Body style={{ border: "1px solid #575757" }}>
          <Container
            style={{
              fontSize: 16,
              marginTop: 12,
              justifyContent: "center",
              padding: 0,
              margin: 0
            }}
          >
            <Col>
              <Row className="justify-content-center mb-5">
                <Col sm={8} md={4}>
                  <Carousel
                    as={"container"}
                    pauseOnHover={false}
                    interval={1500}
                    controls={true}
                    indicators={true}
                    fade={true}
                  >
                    {iphoneAnimation.map(imgSrc => (
                      <Carousel.Item key={imgSrc}>
                        <img src={imgSrc} alt="" style={{ width: 300 }} />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </Col>
              </Row>

              <Row style={{ justifyContent: "center", marginBottom: 25 }}>
                <Col xs={12} lg={8}>
                  <Carousel
                    pauseOnHover={false}
                    interval={1500}
                    controls={true}
                    indicators={true}
                    fade={true}
                    className="shadow"
                  >
                    {screenShotAnimation.map(imgSrc => (
                      <Carousel.Item key={imgSrc}>
                        {windowAspect > 1 ? (
                          <img src={imgSrc} alt="" style={{ width: 700 }} /> //web
                        ) : (
                          <img src={imgSrc} alt="" style={{ width: 300 }} /> //mobile
                        )}
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </Col>
              </Row>
              <Row style={{ justifyContent: "center", marginBottom: 12 }}>
                <h4>Challenge</h4>
              </Row>
              <Row style={{ justifyContent: "center", marginBottom: 20 }}>
                <p>
                  Build a clean, modern, mobile-friendly site to engage patients, listeners, and people interested in
                  his work.
                </p>
              </Row>

              <Row style={{ justifyContent: "center", marginBottom: 12 }}>
                <h4>Solution</h4>
              </Row>
              <Row style={{ marginBottom: 20, justifyContent: "center" }}>
                <Col xs={12} md={10}>
                  <p style={{ textIndent: 40 }}>
                    From the ground up, we created a single page web app that showcases Dr. Berland's work and
                    expertise. We were inspired by his original content, so our design focused on highlighting this
                    work. We accomplished this through the creation of intuitive UI components, limiting of unnecessary
                    visual adornments, and frame based styling.
                  </p>
                </Col>
              </Row>
              <Row style={{ justifyContent: "center", marginBottom: 12 }}>
                <h4>Features</h4>
              </Row>
              <Row style={{ justifyContent: "center", marginBottom: 20 }}>
                <ul>
                  <li>Bespoke web design</li>
                  <li>Single Page Application</li>
                  <li>Twitter, Instagram, ResearchGate, Mapbox Integration</li>
                </ul>
              </Row>
            </Col>
          </Container>
        </Modal.Body>
        <Modal.Footer
          style={{
            border: "1px solid #575757",
            justifyContent: "center",
            backgroundColor: "black",
            color: "white"
          }}
        >
          <Button variant="outline-secondary" onClick={this.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    ) : null;
  }
}

export default About;
