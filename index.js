const textAreaEl = document.querySelector("#inp");
const outputEl = document.querySelector("#outp");
let initText, lastInpIdx, lastInpVal, eventLog, snapshot;

init("0123456789");

// Initialize
function init(_text) {
  // const initText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (!_text) alert("Text undefind");

  initText = _text;
  lastInpIdx = 0;
  lastInpVal = "";
  eventLog = [];
  snapshot = [];

  // Set default value for input
  textAreaEl.value = initText;
  lastInpVal = initText;

  snapshot = initText.split("").map((c, idx) => ({
    c: c,
    orgIdx: idx,
  }));

  // console.log("snapshot initialized", snapshot);
}

//  'keyup' event listener on textarea
textAreaEl.addEventListener(
  "keyup",
  (e) => {
    const name = e.key;
    const code = e.code;

    // console.log(`[Event:Keyup] Key pressed ${name} || Key code value: ${code}`);
    // console.log(
    //   "[Event:Keyup] current position => ",
    //   textAreaEl.selectionStart
    // );

    if (code === "Backspace") {
      saveDeleteEventDebounce();
    } else if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(code)
    ) {
      console.log("User navgatiing..");
      lastInpIdx = textAreaEl.selectionStart;
    } else {
      // taking a naive assumption that everything except backspace and arrow keys is a character key (ignoring Tab, Capslock, shift key, etc)
      saveInsertWithDebounce();
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
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function saveDeleteEvent() {
  const currInpIdx = textAreaEl.selectionStart;

  // remove all the characters between initial and final index
  console.log(
    "init: ",
    lastInpIdx,
    "final: ",
    currInpIdx,
    "characters deleted: ",
    lastInpVal.substring(lastInpIdx, currInpIdx)
  );

  eventLog.push({
    type: "delete",
    st: lastInpIdx,
    en: currInpIdx,
  });

  lastInpIdx = currInpIdx;
  lastInpVal = textAreaEl.value;

  console.log("[Event:Keyup] current position => ", lastInpIdx);
}

function saveInsertEvent() {
  console.log("saveInsertEvent() called");
  const currInpIdx = textAreaEl.selectionStart;
  lastInpVal = textAreaEl.value;

  eventLog.push({
    type: "insert",
    st: lastInpIdx,
    en: currInpIdx,
    val: lastInpVal.substring(lastInpIdx, currInpIdx),
  });

  console.log(
    "last index",
    lastInpIdx,
    "current index",
    currInpIdx,
    "inserted string: ",
    lastInpVal.substring(lastInpIdx, currInpIdx)
  );

  lastInpIdx = currInpIdx;
}

const saveInsertWithDebounce = debounce(saveInsertEvent, 100);
const saveDeleteEventDebounce = debounce(saveDeleteEvent, 100);

// Show event log
const showBtnEl = document.querySelector("#showlog");
showBtnEl.addEventListener("click", (e) => {
  console.log(eventLog);
  // process the snapshot based on eventlog
  showDiff();
});

function showDiff() {
  createDiffSnapshot();
  // show the diff based on the snapshot

  // find deleted indexes
  const delArr = initText.split("").map(c => ({c: c, col: false}));
  for(let i = 0; i < initText.length; i++) {
    let found = snapshot.find((item) => {
      if (item.orgIdx === i) return true;
    })
    if (!found) {
      // show as red
      delArr[i].col = true;
    }
  }

  console.log("Del Arr", delArr);

  const initialEl = document.querySelector("#initial");
  const finalEl = document.querySelector("#final");
  initialEl.innerHTML = "";
  finalEl.innerHTML = "";

  delArr.forEach(item => {
    const spanEl = document.createElement("span");
    spanEl.textContent = item.c;
    if (item.col) {
      spanEl.style.backgroundColor = '#FFCCCB';
    }
    
    initialEl.appendChild(spanEl);
  })

  snapshot.forEach(item => {
    const spanEl = document.createElement("span");
    spanEl.textContent = item.c;
    if (item.orgIdx === -1) {
      spanEl.style.backgroundColor = 'lightgreen';
    }
    
    finalEl.appendChild(spanEl);
  })

  init(lastInpVal);
}


function createDiffSnapshot() {
  let orgStr = initText;

  eventLog.forEach((eve, idx) => {
    if (eve.type === "delete") {
      for (let i = eve.st - 1; i >= eve.en; i--) {
        snapshot.splice(i, 1);
      }
    } else if (eve.type === "insert") {
      for (let i = eve.st, j = 0; i < eve.en; i++, j++) {
        snapshot.splice(i, 0, { c: eve.val[j], orgIdx: -1 });
      }
    } else {
      console.log("Error: unknown event!!");
    }
    console.log("event", idx, "executed =>", eve);
    console.log("snapsot =>", snapshot);
  });

  console.log("final SNAPSHOT =>", snapshot);
}

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
