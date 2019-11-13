import React, { Component, Fragment } from "react";
import posed, { PoseGroup } from "react-pose";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import ContactForm from "./ContactForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons";

const Modal = posed.div({
  enter: {
    y: 0,
    opacity: 1,
    delay: 1000,
    transition: {
      y: { type: "spring", stiffness: 1000, damping: 15 },
      default: { duration: 1000 }
    }
  },
  exit: {
    y: 100,
    opacity: 0,
    transition: { duration: 150 }
  }
});

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: false };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isVisible: !this.state.isVisible
      });
    }, 700);
    setTimeout(2800);
  }

  toggle = () => this.setState({ isVisible: !this.state.isVisible });

  render() {
    const windowAspect = window.innerWidth / window.innerHeight;
    const marginTop = windowAspect > 1 ? -400 : -200;
    const colPadding = windowAspect > 1 ? 50 : 20;

    const { isVisible } = this.state;

    return (
      <Fragment>
        <PoseGroup>
          {isVisible && (
            // If animating more than one child, each needs a `key`
            <Modal
              key="modal"
              style={{
                marginTop: marginTop,
                display: "flex",
                flexDirection: "column"
                // backgroundColor: "red"
                // direction: "row"
              }}
            >
              <Row className="justify-content-center">
                <Col
                  style={{
                    padding: colPadding
                  }}
                >
                  <Row className="justify-content-center">
                    <Image
                      src="images/Will_SlackProfilePic.jpg"
                      roundedCircle
                      width="170px"
                      height="170px"
                      style={{ border: "4px solid" }}
                    ></Image>
                  </Row>
                  <Row className="justify-content-center">
                    <h4>William Griffin</h4>
                  </Row>
                  <Row className="justify-content-center">
                    <i>Los Angeles, California</i>
                  </Row>
                  <Row className="justify-content-center">
                    <a href={`mailto:william@appagetech.com`}>
                      william@appagetech.com
                    </a>
                  </Row>
                </Col>

                <Col
                  style={{
                    padding: colPadding
                  }}
                >
                  <Row className="justify-content-center">
                    <Image
                      src="images/Preston_BW_profilePic2.jpg"
                      roundedCircle
                      width="170px"
                      height="170px"
                      style={{ border: "4px solid" }}
                    ></Image>
                  </Row>
                  <Row className="justify-content-center">
                    <h4>Preston Chaplin</h4>
                  </Row>
                  <Row className="justify-content-center">
                    <i>New York, New York</i>
                  </Row>
                  <Row className="justify-content-center">
                    <a href={`mailto:preston@appagetech.com`}>
                      preston@appagetech.com
                    </a>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col></Col>
                <Col>
                  <ContactForm
                    toggleLockNavigation={this.props.toggleLockNavigation}
                  />
                </Col>
                <Col></Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    href="https://www.instagram.com/appagetechnologies/"
                    target="_blank"
                    variant="light"
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}
                      size="4x"
                      color="black"
                    />
                  </Button>
                </Col>
                <Col>
                  <Button
                    href="https://twitter.com/age_app"
                    target="_blank"
                    variant="light"
                  >
                    <FontAwesomeIcon
                      icon={faTwitterSquare}
                      size="4x"
                      color="black"
                    />
                  </Button>
                </Col>
                <Col>
                  <Button
                    href="https://www.facebook.com/App-Age-Technologies-109527830463591/?modal=admin_todo_tour"
                    target="_blank"
                    variant="light"
                  >
                    <FontAwesomeIcon
                      icon={faFacebookSquare}
                      size="4x"
                      color="black"
                    />
                  </Button>
                </Col>
              </Row>
            </Modal>
          )}
        </PoseGroup>
      </Fragment>
    );
  }
}
export default Contact;
