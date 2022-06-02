// Get a reference to hexInput and inputColor DOM elements
const hexInput = document.getElementById("hexInput");
const inputColor = document.getElementById("inputColor");
// Get a reference to alteredColor and alteredColorText DOM elements
const alteredColor = document.getElementById("alteredColor");
const alteredColorText = document.getElementById("alteredColorText");
// Get a reference to the slider and sliderText DOM elements
const sliderText = document.getElementById("sliderText");
const slider = document.getElementById("slider");
// Get a reference to lightenText, darkenText, toggleBtn DOM elements
const lightenText = document.getElementById("lightenText");
const darkenText = document.getElementById("darkenText");
const toggleBtn = document.getElementById("toggleBtn");
// Get a reference to resetBtn DOM elements
const resetBtn = document.getElementById("resetBtn");

// Click event listener to the toggle btn
toggleBtn.addEventListener("click", () => {
  if (toggleBtn.classList.contains("toggled")) {
    toggleBtn.classList.remove("toggled");
    lightenText.classList.remove("unselected");
    darkenText.classList.add("unselected");
  } else {
    toggleBtn.classList.add("toggled");
    lightenText.classList.add("unselected");
    darkenText.classList.remove("unselected");
  }
  // Call reset()
  reset();
});

// Create a keyup event handler for hexInput
// The keyup event is fired when a key is released.
hexInput.addEventListener("keyup", () => {
  // Take the input html element's value
  const hex = hexInput.value;
  // Exit if hex is not valid
  if (!isValidHex(hex)) return;
  //iMPORTANT! Hex and strippedHex are NOT global variables so we have to add # to be a valid backgroundcolor in CSS
  const strippedHex = hex.replace("#", "");
  inputColor.style.backgroundColor = "#" + strippedHex;
  // Call reset()
  reset();
});

//check to see whether the input from the user is a valid
const isValidHex = (hex) => {
  // return false if hex is invalid
  if (!hex) return false;
  // Declare and assign to strippedHex the string hex without the # as first character
  const strippedHex = hex.replace("#", "");
  // Return true if strippedHex has 3 or 6 characters
  return strippedHex.length === 3 || strippedHex.length === 6;
  //IMPORTANT! This function doesn't check if all characters are valid
};

// Create a function to convert Hex to RGB to make easier color darkening and lightening
const convertHexToRGB = (hex) => {
  // Return null if hex is not valid
  if (!isValidHex(hex)) return null;

  let strippedHex = hex.replace("#", "");

  //If hex is 3 chars long, double every chars to make it 6 chars long
  if (strippedHex.length === 3) {
    strippedHex =
      strippedHex[0] +
      strippedHex[0] +
      strippedHex[1] +
      strippedHex[1] +
      strippedHex[2] +
      strippedHex[2];
  }
  //console.log(strippedHex);

  // The substring() method extracts characters, between two indices (positions), from a string, and returns the substring.
  // The substring() method extracts characters from start to end (exclusive=end not included).
  // parseInt() converts a string into an integer of the specified radix: in this case 16
  const r = parseInt(strippedHex.substring(0, 2), 16);
  const g = parseInt(strippedHex.substring(2, 4), 16);
  const b = parseInt(strippedHex.substring(4, 6), 16);
  // return object like this: {r: 255, g: 255, b: 255}
  return { r, g, b };
};
// console.log(convertHexToRGB("ffa"));

// Create the function converRGBToHex
const convertRGBToHex = (r, g, b) => {
  // toString() returns a string representation of an object using base 16
  // Sometimes toString() can return just a single number so
  // No matter what the method returns, add a "0" at the start and with slice(-2) just return the last 2 string's characters
  const firstPair = ("0" + r.toString(16)).slice(-2);
  const secondPair = ("0" + g.toString(16)).slice(-2);
  const thirdPair = ("0" + b.toString(16)).slice(-2);

  // OR use this simple length control but REMEMBER to define  firstPair, secondPair and thirdPair as let variable
  // if (firstPair.length === 1) {
  // firstPair = "0" + firstPair;
  // }
  // if (secondPair.length === 1) {
  // secondPair = "0" + secondPair;
  // }
  // if (thirdPair.length === 1) {
  // thirdPair = "0" + thirdPair;
  // }

  // Add # at the start to the final converted string
  const hex = "#" + firstPair + secondPair + thirdPair;
  return hex;
};
// console.log(convertRGBToHex(0, 43, 224));

// Create a function increaseWithinRange0To255() that ensures hex values stay between 0 and 255
const increaseWithinRange0To255 = (hex, amount) => {
  const newHex = hex + amount;
  if (newHex > 255) return 255;
  if (newHex < 0) return 0;
  return newHex;
  // OR use some Math's methods
  // return Math.min(255, Math.max(0, hex + amount));
};

// Create the alterColor function which accepts hex value and percentage
const alterColor = (hex, percentage) => {
  // Convert the hex value to rgb
  // Deconstruct into r, g, and b directly into an object
  const { r, g, b } = convertHexToRGB(hex);
  //console.log({ r, g, b });

  // Increase each r,g,b value by appropriate amount (percentage of 255)
  const amount = Math.floor((percentage / 100) * 255);
  //console.log(amount);
  const newR = increaseWithinRange0To255(r, amount);
  const newG = increaseWithinRange0To255(g, amount);
  const newB = increaseWithinRange0To255(b, amount);
  console.log({ newR, newG, newB });

  // Use the new r,g,b values to convert to a hex value
  // Return the hex value
  return convertRGBToHex(newR, newG, newB);
};

// console.log(alterColor("#000", -10));

// Create an input event listener for slider element
slider.addEventListener("input", () => {
  // Take the input html element's value
  // Exit if hexInout is not valid
  if (!isValidHex(hexInput.value)) return;
  //display the value of the slider
  sliderText.textContent = `${slider.value}%`;

  //Calculate the appropriate value for the color alteration between positive and negative
  const valueAddition = toggleBtn.classList.contains("toggled")
    ? -slider.value
    : slider.value;
  // OR in a easier way
  // let valueAddition = 0;
  // if (toggleBtn.classList.contains("toggled")) {
  // valueAddition = -slider.value;
  // } else {
  // valueAddition = slider.value;
  // }

  //get the altered hex value
  const alteredHex = alterColor(hexInput.value, valueAddition);
  //update the altered color

  alteredColor.style.backgroundColor = alteredHex;
  alteredColorText.innerText = `Altered Color: ${alteredHex}`;
});

// Create a function reset() which resets slider, input and altered colors everytime toggle is clicked
const reset = () => {
  // Set slider value to 0 and slider text to 0%
  slider.value = 0;
  sliderText.innerText = `0%`;
  // Set altered color to original input color
  alteredColor.style.backgroundColor = hexInput.value;
  // Reset alteredColorText to original input
  alteredColorText.innerText = `Altered Color: ${hexInput.value}`;
};

// Create an input event listener for reset button
resetBtn.addEventListener("dblclick", () => {
  reset();
});
