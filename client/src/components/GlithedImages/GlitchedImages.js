import {
  ArrowNavigation,
  useArrowNavigationWithFocusState,
} from "react-arrow-navigation";
// import { postImage } from "../../services/postImage";
import { useRef } from "react";

const NavigationChild = ({ xIndex, yIndex, img, imageID }) => {
  const {
    focusProps: { ref, tabIndex },
  } = useArrowNavigationWithFocusState(xIndex, yIndex);

  return (
    <a
      className="child glitched_container"
      ref={ref}
      tabIndex={tabIndex}
      href={img}
      download={imageID}
    >
      <img src={img} alt={imageID} className="img glitched_img"></img>
    </a>
  );
};

export const GlitchedImages = ({ glitchedArray, imageID }) => {
  const navRef = useRef();

  return (
    <ArrowNavigation className="nav" ref={navRef} initialIndex={[0, 0]}>
      <NavigationChild
        xIndex={0}
        yIndex={0}
        img={glitchedArray[0]}
        imageID={imageID}
      />
      <NavigationChild
        xIndex={1}
        yIndex={0}
        img={glitchedArray[2]}
        imageID={imageID}
      />
      <NavigationChild
        xIndex={2}
        yIndex={0}
        img={glitchedArray[4]}
        imageID={imageID}
      />
      <NavigationChild
        xIndex={0}
        yIndex={1}
        img={glitchedArray[1]}
        imageID={imageID}
      />
      <NavigationChild
        xIndex={1}
        yIndex={1}
        img={glitchedArray[3]}
        imageID={imageID}
      />
      <NavigationChild
        xIndex={2}
        yIndex={1}
        img={glitchedArray[5]}
        imageID={imageID}
      />
    </ArrowNavigation>
  );
};
