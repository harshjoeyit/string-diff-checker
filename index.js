console.log("Hello");

const textAreaEl = document.querySelector("#inp");
const outputEl = document.querySelector("#outp");
let lastInpIdx = 0;
let lastInpVal = "";

//
let eventLog = [];

// Initialize
(function init() {
  // const initText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const initText = "0123456789";
  // Set default value for input
  textAreaEl.value = initText;
  lastInpVal = initText;
})();

//  'keyup' event listener on textarea
textAreaEl.addEventListener("keyup", (e) => {
    const name = e.key;
    const code = e.code;

    // console.log(`[Event:Keyup] Key pressed ${name} || Key code value: ${code}`);
    // console.log(
    //   "[Event:Keyup] current position => ",
    //   textAreaEl.selectionStart
    // );
    
    if (code === "Backspace") {
      
      const currInpIdx = textAreaEl.selectionStart;
      
      // remove all the characters between initial and final index
      console.log("init: ", lastInpIdx, 
      "final: ", currInpIdx, 
      "characters deleted: ", lastInpVal.substring(lastInpIdx, currInpIdx));

      eventLog.push({
        type: "delete",
        st: lastInpIdx,
        en: currInpIdx,
      });
    
      lastInpIdx = currInpIdx;
      lastInpVal = textAreaEl.value;

      console.log("[Event:Keyup] current position => ", lastInpIdx);
    
    } else {
      // taking a naive assumption that everything except backspace is a character key (ignoring Tab, Capslock, shift key, etc) 
    
      // save insert event
      saveInsertWithDebounce()
    }
  },
  false
);

// 'click' even listener
textAreaEl.addEventListener("click", (e) => {
  // Get the cursor position
  const cursorPosition = textAreaEl.selectionStart;
  // Reset current index
  lastInpIdx = cursorPosition;
  console.log("[Event:Click] current position", lastInpIdx);
});


function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function saveInsertEvent() {
  console.log("saveInsertEvent() called")
  const currInpIdx = textAreaEl.selectionStart;
  lastInpVal = textAreaEl.value;
  
  eventLog.push({
    type: "insert",
    st: lastInpIdx,
    en: currInpIdx,
    val: lastInpVal.substring(lastInpIdx, currInpIdx)
  });

  console.log("last index", lastInpIdx, "current index", currInpIdx, "inserted string: ", lastInpVal.substring(lastInpIdx, currInpIdx));
  
  lastInpIdx = currInpIdx;
}

const saveInsertWithDebounce = debounce(saveInsertEvent, 500);


// Show event log 
const showBtnEl = document.querySelector("#showlog");
showBtnEl.addEventListener("click", (e) => {
  console.log(eventLog);
})

/*
1. TODO: 
we need special condition for some keystrokes. For eg -
1. Pressing Caps Lock, Tab,
2. Press Shift and char to type in uppercase characters
3. Enter (nextline)
4. Ctrl, Alt, Meta
5. Arrow Keys (Left, right, top, bottom), will monitor index

There might be some more...
*/

/*
2. TODO: 
Need to handle some events like "onpast", "cut"
*/

/*
3.
Why can't we use 'keyup' event instead of 'keydown' event.
1. keydown fires multiple times when we keep the key pressed, while keyup only fires onces.
*/

/*
Case: When user deletes and adds the same content, and vice versa.
*/

/*
Case: When user uses Undo op (Ctrl + Z)
*/

