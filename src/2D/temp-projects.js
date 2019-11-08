import React, { Component } from "react";
import Carousel from "react-bootstrap/Carousel";
import BerlandDetail from "./BerlandDetail";
import TodaysIposDetail from "./TodaysIposDetail";
import posed from "react-pose";

const Box = posed.div({
  hoverable: true,
  pressable: true,
  init: {
    scale: 1,
    boxShadow: "0px 0px 0px rgba(0,0,0,0)"
  },
  hover: {
    scale: 1.2,
    boxShadow: "0px 5px 10px rgba(0,0,0,0.2)"
  },
  press: {
    scale: 1.1,
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
  }
});

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

    const variableWidth = windowAspect > 1 ? 450 : 420;

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
            <div className="column-md-6" style={{ width: variableWidth, marginBottom: 25, marginRight: 25 }}>
              <Carousel
                pauseOnHover={false}
                interval={1500}
                controls={false}
                indicators={false}
                fade={true}
                className="shadow"
                onClick={this.onClickBerland}
                activeIndex={overlayIndex}
                // defaultActiveIndex={overlayIndex}
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleHover}
                onSelect={null}
              >
                {berlandPics.map(imgSrc => (
                  <Carousel.Item key={imgSrc}>
                    <img src={imgSrc} alt="" style={{ width: variableWidth }} />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
            <div className="column-md-6" style={{ width: variableWidth }}>
              <Carousel
                pauseOnHover={false}
                interval={1500}
                controls={false}
                indicators={false}
                fade={true}
                className="shadow"
                onClick={this.onClickTodaysIpos}
                activeIndex={overlayIndex}
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleHover}
                onSelect={null}
              >
                {todaysPics.map(imgSrc => (
                  <Carousel.Item key={imgSrc}>
                    <img src={imgSrc} alt="" style={{ width: variableWidth }} />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Projects;