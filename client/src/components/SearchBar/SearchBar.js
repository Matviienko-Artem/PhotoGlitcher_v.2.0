import { useCallback } from "react";

export default function SearchBar({
  inputQuery,
  keyQuery,
  dowloadQuery,
  onInputQueryChange,
  onKeyQueryChange,
  onDowloadQueryChange,
  onSubmitButtonClick,
  isLoading,
}) {
  const handleChangeInput = useCallback((e) => {
    onInputQueryChange(e.target.value);
  });

  const handleChangeKey = useCallback((e) => {
    onKeyQueryChange(e.target.value);
  });

  const handleChangeDowload = useCallback((e) => {
    onDowloadQueryChange(e.target.files);
  });

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    onSubmitButtonClick();
  });

  return (
    <div className="nav_bar">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="query_input">Введіть запит :</label>
          <input
            type="text"
            name="query_input"
            id="query_input"
            value={inputQuery}
            onChange={handleChangeInput}
          />
        </div>

        <div>
          <label htmlFor="key_input">Введіть ключ Unsplash:</label>
          <input
            type="text"
            name="key_input"
            id="key_input"
            value={keyQuery}
            onChange={handleChangeKey}
          />
        </div>

        <div>
          <label htmlFor="dowload_input" className="dowload_input">
            {!dowloadQuery || dowloadQuery.length === 0
              ? "Завантажити файли з комп'ютера"
              : `Локальні фото : ${dowloadQuery.length}`}
          </label>

          <input
            type="file"
            accept="image/*"
            name="dowload_input"
            multiple
            id="dowload_input"
            onChange={handleChangeDowload}
          />
        </div>

        <button disabled={isLoading}>Поїхали</button>
      </form>
    </div>
  );
}
