export default function Navigation({
  nextPage,
  glitchImages,
  setNextPage,
  imageData,
  setGlitchedImagesArr,
  setIsLoading,
  search,
}) {
  return (
    <div className="navigation">
      {!nextPage && (
        <>
          <button type="button" className="request" onClick={() => search()}>
            Новий запит
          </button>
          <button
            type="button"
            className="next"
            onClick={() => {
              glitchImages(imageData, setGlitchedImagesArr);
              setNextPage(true);
            }}
          >
            Глюкнути
          </button>
        </>
      )}
      {nextPage && (
        <>
          <button
            tabIndex={-1}
            type="button"
            className="request"
            onClick={() => {
              search();
              setIsLoading(true);
              setNextPage(false);
            }}
          >
            Назад
          </button>
          <button
            tabIndex={-1}
            type="button"
            className="next"
            onClick={() => glitchImages(imageData, setGlitchedImagesArr)}
          >
            Знову глюкнути
          </button>
        </>
      )}
    </div>
  );
}
