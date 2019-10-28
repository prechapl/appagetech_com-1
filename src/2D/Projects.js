import React, { Component } from "react";
import Carousel from "react-bootstrap/Carousel";
import BerlandDetail from "./BerlandDetail";
import TodaysIposDetail from "./TodaysIposDetail";
import posed from "react-pose";
import SplitText from "react-pose-text";

const Box = posed.div({
  hoverable: true,
  pressable: true,
  init: {
    scale: 1,
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
  },
  hover: {
    scale: 1.2,
    boxShadow: "0px 5px 10px rgba(0,0,0,0.3)"
  },
  press: {
    scale: 1.1,
    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)"
  }
});
const charPoses = {
  exit: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex }) => charIndex * 100
  }
};

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBerlandDetail: false,
      showTodaysIposDetail: false,
      isHovered: false
    };
  }

  onClickBerland = e => {
    e.preventDefault();
    this.setState({ showBerlandDetail: true });
  };
  onClickTodaysIpos = e => {
    e.preventDefault();
    this.setState({ showTodaysIposDetail: true });
  };

  handleHover = () => {
    this.setState(prevState => ({
      isHovered: !prevState.isHovered
    }));
  };

  render() {
    const berlandPics = [
      "images/berlandAnimations/ScreenShots_Berland-width-525-SolidWhite.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-1.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-2.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-3.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-4.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-5.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-6.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-7.png"
    ];
    const todaysPics = [
      "images/todaysIposAnimation/ScreenShots_TodaysIpos_525-SolidWhite.png",
      "images/todaysIposAnimation/ScreenShots_TodaysIpos_width525-1.png",
      "images/todaysIposAnimation/ScreenShots_TodaysIpos_width525-2.png",
      "images/todaysIposAnimation/ScreenShots_TodaysIpos_width525-3.png",
      "images/todaysIposAnimation/ScreenShots_TodaysIpos_width525-4.png",
      "images/todaysIposAnimation/ScreenShots_TodaysIpos_width525-5.png"
    ];
    const windowAspect = window.innerWidth / window.innerHeight;
    const variableWidth = windowAspect > 1 ? 250 : 420;
    const variableMarginTop = windowAspect > 1 ? -300 : 0;
    const overlayIndex = !this.state.isHovered ? undefined : 0;

    return (
      <div>
        <BerlandDetail show={this.state.showBerlandDetail} onHide={() => this.setState({ showBerlandDetail: false })} />
        <TodaysIposDetail
          show={this.state.showTodaysIposDetail}
          onHide={() => this.setState({ showTodaysIposDetail: false })}
        />
        <div className="container" style={{ marginTop: variableMarginTop }}>
          <div className="row justify-content-center">
            <Box
              className="box"
              onPressStart={this.onClickBerland}
              style={{
                background: "radial-gradient(#ff8684 50%, #E85656)",
                color: "white",
                borderRadius: "30px",
                width: variableWidth,
                height: variableWidth,
                marginBottom: 25,
                marginRight: 50,
                display: "flex",
                alignItems: "center"
              }}
            >
              <div className="container">
                <div className="row justify-content-center">
                  <h5>
                    <SplitText initialPose="exit" pose="enter" charPoses={charPoses}>
                      toddberland.com
                    </SplitText>
                  </h5>
                </div>
              </div>
            </Box>

            <Box
              className="box"
              onPressStart={this.onClickTodaysIpos}
              style={{
                background: "radial-gradient(#55d07a 40%, #1A9C3F)",
                color: "white",
                borderRadius: "30px",
                width: variableWidth,
                height: variableWidth,
                marginBottom: 25,
                marginRight: 50,
                display: "flex",
                alignItems: "center"
              }}
            >
              <div className="container">
                <div className="row justify-content-center">
                  <h5>
                    <SplitText initialPose="exit" pose="enter" charPoses={charPoses}>
                      todaysipos.com
                    </SplitText>
                  </h5>
                </div>
              </div>
            </Box>
          </div>
        </div>
      </div>
    );
  }
}

export default Projects;
