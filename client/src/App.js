import "./App.css";
import "cropperjs/dist/cropper.css";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Puff } from "react-loader-spinner";
import Cropper from "react-cropper";
import throttle from "lodash.throttle";
import { fetchRandomImage } from "./services/unsplash";
import { useEventListener } from "./utils/useEventListener";
import { glitchImages } from "./utils/glitchImages";
import { GlitchedImages } from "./components/GlithedImages/GlitchedImages";
import SearchBar from "./components/SearchBar/SearchBar";
import Navigation from "./components/Navigation/Navigation";
import { usePrevious } from "./utils/usePrevious";

// запис у localStarage для зберігання вибракованих фото ------------------ треба щось інше придумати !!!
let localDefectiveImage = [];
if (localStorage.getItem("localDefectiveImage")) {
  localDefectiveImage = JSON.parse(localStorage.getItem("localDefectiveImage"));
}

// let lastIdImage = "";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [keyQuery, setKeyQuery] = useState(
    `${process.env.REACT_APP_ACCESS_KEY}`
  );
  const [dowloadQuery, setDowloadQuery] = useState();
  const [imageSrc, setImageSrc] = useState("");
  const [imageID, setImageID] = useState("");
  const [imageData, setImageData] = useState({});
  const [glitchedImagesArr, setGlitchedImagesArr] = useState([]);
  const [nextPage, setNextPage] = useState(false);
  const [cropper, setCropper] = useState();
  const [imagesArray, setImagesArray] = useState();

  const prevInputSearchQuery = usePrevious(inputQuery);

  useEffect(() => {
    if (!imagesArray) {
      return;
    }
    setIsLoading(true);

    if (imagesArray.length === 0) {
      getImage(inputQuery, keyQuery);
      return;
    }

    loadImage(imagesArray[0]);
  }, [imagesArray]);

  const getImage = (query, accesKey) => {
    console.log("fetch images");

    fetchRandomImage(query, accesKey)
      .then((image) => {
        setImagesArray(image);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const cropperRef = useRef(HTMLImageElement);

  const onCrop = useCallback(() => {
    const imageElement = cropperRef?.current;
    const localCropper = imageElement?.cropper;
    setCropper(localCropper);
    const canvas = localCropper.getCroppedCanvas({ width: 2160, height: 2160 });

    if (canvas && !nextPage) {
      const ctx = canvas.getContext("2d");
      setImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
  });

  const deleteFirstImageInArray = useCallback(() => {
    imagesArray.shift();
    setImagesArray([...imagesArray]);
    if (dowloadQuery) {
      dowloadQuery.shift();
      setDowloadQuery([...dowloadQuery]);
    }
  }, [imagesArray, dowloadQuery]);

  const loadImage = useCallback((data) => {
    if (localDefectiveImage.find((item) => item === data.id)) {
      console.log("така картинка вже вибракувана");

      deleteFirstImageInArray();
      return;
    }

    if (data.type) {
      setImageSrc(window.URL.createObjectURL(data));
      return;
    }

    if (data.width > data.height) {
      setImageSrc(data.urls.raw + "&h=2160&dpr=1");
      setImageID(data.id);
    } else {
      setImageSrc(data.urls.raw + "&w=2160&dpr=1");
      setImageID(data.id);
    }

    // lastIdImage = data.id;
    if (data.id) {
      localDefectiveImage.push(data.id);
      localStorage.setItem(
        "localDefectiveImage",
        JSON.stringify(localDefectiveImage)
      );
    }

    console.log("йдемо далі");
  });

  const onInputQueryChange = useCallback((query) => {
    setInputQuery(query);
  });

  const onKeyQueryChange = useCallback((query) => {
    setKeyQuery(query);
  });

  const onDowloadQueryChange = useCallback((filelist) => {
    setDowloadQuery(Array.from(filelist));
    setImagesArray(Array.from(filelist));
  });

  const search = useCallback(() => {
    if (
      !imagesArray ||
      imagesArray.length === 0 ||
      inputQuery !== prevInputSearchQuery
    ) {
      setImagesArray([]);
    } else {
      deleteFirstImageInArray();
    }
  }, [inputQuery, prevInputSearchQuery, imagesArray]);

  const onKeyDown = useCallback((e) => {
    if (!e.shiftKey) {
      return;
    }

    switch (e.key) {
      case ">": {
        glitchImages(imageData, setGlitchedImagesArr);
        setNextPage(true);
        break;
      }
      case "<": {
        search();
        setIsLoading(true);
        setNextPage(false);
        break;
      }
      case "L": {
        if (isLoading || nextPage) {
          return;
        }
        search();

        break;
      }

      default:
    }
  });

  const onKeyDownForCropper = useCallback(
    (event) => {
      if (!cropper) {
        return;
      }

      switch (event.keyCode) {
        case 38:
          event.preventDefault();
          cropper.move(0, 2);
          break;

        case 40:
          event.preventDefault();
          cropper.move(0, -2);
          break;

        case 37:
          event.preventDefault();
          cropper.move(2, 0);
          break;

        case 39:
          event.preventDefault();
          cropper.move(-2, 0);
          break;
        default:
          break;
      }

      if (!event.shiftKey) {
        return;
      }

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          cropper.move(0, 16);
          break;

        case "ArrowDown":
          event.preventDefault();
          cropper.move(0, -16);
          break;

        case "ArrowRight":
          event.preventDefault();
          cropper.move(-16, 0);
          break;

        case "ArrowLeft":
          event.preventDefault();
          cropper.move(16, 0);
          break;
        default:
          break;
      }
    },
    [cropper]
  );

  useEventListener("keydown", onKeyDown);
  useEventListener("keydown", onKeyDownForCropper);

  return (
    <div className="App">
      <Navigation
        nextPage={nextPage}
        glitchImages={glitchImages}
        setNextPage={setNextPage}
        imageData={imageData}
        setGlitchedImagesArr={setGlitchedImagesArr}
        setIsLoading={setIsLoading}
        search={search}
      />
      {!nextPage && (
        <SearchBar
          inputQuery={inputQuery}
          keyQuery={keyQuery}
          dowloadQuery={dowloadQuery}
          onInputQueryChange={onInputQueryChange}
          onKeyQueryChange={onKeyQueryChange}
          onDowloadQueryChange={onDowloadQueryChange}
          isLoading={isLoading}
          onSubmitButtonClick={search}
        />
      )}

      <div className="grid">
        {nextPage && (
          <GlitchedImages glitchedArray={glitchedImagesArr} imageID={imageID} />
        )}

        {!nextPage && (
          <div className="img_container">
            {isLoading && <Puff color="#ff3a00" height={80} width={80} />}
            {/* <img src={imageSrc}></img> */}
            <Cropper
              src={imageSrc}
              ready={() => setIsLoading(false)}
              crop={throttle(onCrop, 300)}
              ref={cropperRef}
              className="img"
              style={{ height: "100%", width: "100%" }}
              viewMode={1}
              dragMode={"none"}
              initialAspectRatio={1 / 1}
              zoomable={false}
              autoCropArea={1}
              background={false}
              cropBoxResizable={false}
              responsive={false}
              // minCanvasWidth={2160}
              // minCanvasHeight={2160}
              // minCropBoxHeight={2160}
              // minCropBoxWidth={2160}
              guides={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
