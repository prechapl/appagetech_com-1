import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import "./contact.css";
import ContactForm from "./ContactForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { scale } from "style-value-types";

class Contact extends Component {
  render() {
    const windowAspect = window.innerWidth / window.innerHeight;
    const marginTop = windowAspect > 1 ? -350 : 0;
    const marginX = windowAspect > 1 ? 0 : -15;
    return (
      <div
        style={{
          // marginTop: marginTop,
          backgroundColor: "red",
          marginLeft: marginX,
          marginRight: marginX,
          padding: 0
        }}
      >
        <Row>
          <Col
            className="align-items-center"
            style={{ marginLeft: 0, marginRight: 0, marginBottom: 3 }}
          >
            <Row className="mb-1">
              <Image
                src="images/Will_SlackProfilePic.jpg"
                roundedCircle
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
            style={{ marginLeft: 0, marginRight: 0, marginBottom: 2 }}
          >
            <Row className="mb-1">
              <Image
                src="images/Preston_BW_profilePic2.jpg"
                roundedCircle
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
          <Col className="d-flex flex-row">
            <ContactForm
              toggleLockNavigation={this.props.toggleLockNavigation}
            />
          </Col>
          <FontAwesomeIcon icon={faTwitterSquare} size="9x" />
        </Row>
      </div>
    );
  }
}

export default Contact;
