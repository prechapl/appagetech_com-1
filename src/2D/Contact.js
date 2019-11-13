import React, { Component, Fragment } from "react";
import posed, { PoseGroup } from "react-pose";
import SplitText from "react-pose-text";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import ContactForm from "./ContactForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

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
    const marginTop = windowAspect > 1 ? -260 : -350;
    const textSize = windowAspect > 1 ? 20 : 24;
    const lineSpace = windowAspect > 1 ? 2.3 : 1.8;
    const paddingX = windowAspect > 1 ? 130 : 80;
    const strongTextSize = windowAspect > 1 ? 36 : 28;
    const marginX = windowAspect > 1 ? 0 : -110;

    const { isVisible } = this.state;

    return (
      <Fragment>
        <PoseGroup>
          {isVisible && (
            // If animating more than one child, each needs a `key`
            <Modal
              key="modal"
              style={{
                marginTop: marginTop
              }}
            >
              <Row>
                <Col
                  className="align-items-center"
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginBottom: 3
                  }}
                >
                  <Row className="mb-1">
                    <Image
                      src="images/Will_SlackProfilePic.jpg"
                      roundedCircle
                      width="170px"
                      height="170px"
                    ></Image>
                  </Row>
                  <Row>
                    <h4>William Griffin</h4>
                  </Row>
                  <Row>
                    <i>Los Angeles, California</i>
                  </Row>
                  <Row>
                    <a href={`mailto:william@appagetech.com`}>
                      william@appagetech.com
                    </a>
                  </Row>
                </Col>

                <Col
                  className="align-items-center"
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginBottom: 2
                  }}
                >
                  <Row className="mb-1">
                    <Image
                      src="images/Preston_BW_profilePic2.jpg"
                      roundedCircle
                      width="170px"
                      height="170px"
                    ></Image>
                  </Row>
                  <Row>
                    <h4>Preston Chaplin</h4>
                  </Row>
                  <Row>
                    <i>New York, New York</i>
                  </Row>
                  <Row>
                    <a href={`mailto:preston@appagetech.com`}>
                      preston@appagetech.com
                    </a>
                  </Row>
                </Col>
                <div className="w-100"></div>
                <Row>
                  <ContactForm
                    toggleLockNavigation={this.props.toggleLockNavigation}
                  />
                  <Button>
                    <FontAwesomeIcon icon={faTwitterSquare} size="7x" />
                  </Button>
                  <FontAwesomeIcon icon={faInstagram} size="7x" />
                  <FontAwesomeIcon icon={faFacebookSquare} size="7x" />
                </Row>
              </Row>
            </Modal>
          )}
        </PoseGroup>
      </Fragment>
    );
  }
}
export default Contact;
