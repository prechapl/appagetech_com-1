import React, { Component, Fragment } from "react";
import posed, { PoseGroup } from "react-pose";

const Modal = posed.div({
  enter: {
    y: 0,
    opacity: 1,
    delay: 300,
    transition: {
      y: { type: "spring", stiffness: 1000, damping: 15 },
      default: { duration: 300 }
    }
  },
  exit: {
    y: 50,
    opacity: 0,
    transition: { duration: 150 }
  }
});

const Shade = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 }
});

class About extends Component {
  state = { isVisible: true };

  componentDidMount() {
    this.setState({ isVisible: this.state.isVisible });
  }
  render() {
    const windowAspect = window.innerWidth / window.innerHeight;
    const marginTop = windowAspect > 1 ? 350 : 1200;
    const textSize = windowAspect > 1 ? 20 : 24;
    const lineSpace = windowAspect > 1 ? 2 : 1.8;
    const paddingX = windowAspect > 1 ? 150 : 0;
    const strongTextSize = windowAspect > 1 ? 42 : 36;

    const { isVisible } = this.state;
    return (
      <Fragment>
        <PoseGroup>
          {isVisible && [
            // If animating more than one child, each needs a `key`
            <Shade
              key="shade"
              style={{
                position: "absolute",
                background: "rgba(0, 0, 0, 0.8)",
                top: marginTop,
                left: 0,
                right: 0,
                bottom: 0
              }}
            />,
            <Modal
              key="modal"
              style={{
                position: "absolute",
                width: "900px",
                height: "1200px",
                background: "white",
                borderRadius: "10px",
                top: marginTop
              }}
            >
              <div class="container d-flex">
                <div
                  class="column"
                  // style={{
                  //   marginTop: marginTop,
                  //   paddingLeft: paddingX,
                  //   paddingRight: paddingX,
                  //   marginLeft: 0,
                  //   marginRight: 0
                  // }}
                >
                  <div class="row justify-content-center">
                    <div class="jumbotron-fluid">
                      <p
                        class="lead"
                        style={{
                          fontSize: textSize,
                          lineHeight: lineSpace,
                          textAlign: "justify",
                          marginBottom: 50,
                          padding: 0,
                          marginLeft: -15,
                          marginRight: -15
                        }}
                      >
                        <strong style={{ fontSize: strongTextSize }}>App Age Technologies </strong> produces software
                        that informs, entertains, solves problems and enriches lives. Co-founders William Griffin and
                        Preston Chaplin bring unique and impressive professional experiences to this vanguard software
                        development company. Decades of experience in digital imaging and high-profile advertising
                        production provides assurance that your brand will be presented in the best possible light via
                        App Age software. Extensive experience manipulating highly technical data for the financial
                        industry and providing financial consulting for businesses big and small ensures that App Age
                        can tackle complex technical challenges and advise clients of any size on the best paths to
                        success. From microsites to distributed mobile apps, we’re software developers devoted to
                        delivering success in surprising ways.
                      </p>
                    </div>
                  </div>

                  <div class="row justify-content-center" style={{ textSize: textSize, marginBottom: 50 }}>
                    <div class="jumbotron-fluid">
                      <div class="row justify-content-center lead">
                        <div class="column">
                          <div class="row justify-content-center">
                            <strong style={{ fontSize: strongTextSize }}>App Age Services </strong>
                          </div>
                          <div class="dropdown-divider mb-4"></div>
                          <div
                            class="row "
                            style={{
                              fontSize: textSize
                            }}
                          >
                            <div class="column mr-5">
                              <p>Web Development</p>
                              <p>Tech Product Design</p>
                              <p>iOS Development</p>
                              <p>Android Development</p>
                              <p>Frontend Web Creation</p>
                              <p>Backend Engineering </p>
                              <p>Cloud services</p>
                            </div>
                            <div class="column">
                              <p>Process Automation</p>
                              <p>Web Animations</p>
                              <p>Interactive 3D Elements</p>
                              <p>Computer Generated 3D Imaging</p>
                              <p>Expert Photo Retouching</p>
                              <p>Still Photography</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row justify-content-center" style={{ textSize: textSize }}>
                    <div class="jumbotron-fluid">
                      <div class="row justify-content-center lead">
                        <div class="column">
                          <strong style={{ fontSize: strongTextSize }}>Engagement Models </strong>
                          <div class="dropdown-divider mb-4"></div>
                          <p>Fixed Price Contract</p>
                          <p>Hourly Development Work</p>
                          <p>Equity Based Partnerships</p>
                          <p>Project Specific Consulting</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          ]}
        </PoseGroup>
      </Fragment>
    );
  }
}

export default About;