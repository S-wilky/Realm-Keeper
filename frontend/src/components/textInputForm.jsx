import { useState } from "react";
// import { Image, View } from 'react-native';

function TextInputForm(props) {
  const [inputValue, setValue] = useState("");
  // inputValue = defaultValue;

  props.onSubmit(inputValue);

  return (
    <label>
      {props.label}
      <input
        type="text"
        value={inputValue} //Whatever the state is, that is what the value of the input field will be
        onChange={(e) => setValue(e.target.value)} //When you type, this function runs and updates the state
      />
    </label>
  );
}

export default TextInputForm;
