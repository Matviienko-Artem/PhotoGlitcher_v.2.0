import glitch from "glitch-canvas";

export const glitchImages = (data, setToState) => {
  setToState([]);

  for (let index = 0; index < 6; index++) {
    const glitchParams = {
      seed: Math.floor(Math.random() * 99),
      quality: Math.floor(Math.random() * 99),
      amount: Math.floor(Math.random() * 99),
      iterations: Math.floor(Math.random() * 99),
    };

    glitch(glitchParams)
      .fromImageData(data)
      .toDataURL()
      .then((dataURL) => {
        setToState((prevState) => [...prevState, dataURL]);
      });
  }
};
