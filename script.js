let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');
let timerTime = document.getElementById('time');
let addOneMinute = document.getElementById('adjustment');
let resetTimer = document.getElementById('reset');
let statusBox = document.getElementById('statusBox');
let durationBox = document.getElementById('durationBox');
let sound = document.getElementById('sound');
let workTime;
let shortBreakTime;
let longBreakTime;
let totalTime;
let isWork = true;
let duration = 0;
let runTime;
let isInit = false;
let status = 'not start';
let isStart = false;
let isStop = true;

// when page loaded, use cookies to alter the site
window.addEventListener('load', () => {
  if (document.cookie != '') {
    document.getElementById('workTime').value = document.cookie.split('; ').find(row => row.startsWith('workTime')).split('=')[1];
    document.getElementById('shortBreakTime').value = document.cookie.split('; ').find(row => row.startsWith('shortBreakTime')).split('=')[1];
    document.getElementById('longBreakTime').value = document.cookie.split('; ').find(row => row.startsWith('longBreakTime')).split('=')[1];
    setTime(document.getElementById('workTime').value*60);
    totalTime = document.getElementById('workTime').value*60;
  }
});

// use to initialization
const init = () => {
  status = 'work';
  statusBox.innerHTML = `status: ${status}`;
  durationBox.innerHTML = `duration: ${duration}`;
  let rawWorkTime = document.getElementById('workTime').value;
  let rawShortBreakTime = document.getElementById('shortBreakTime').value;
  let rawLongBreakTime = document.getElementById('longBreakTime').value;
  workTime = rawWorkTime * 60;
  shortBreakTime = rawShortBreakTime * 60;
  longBreakTime = rawLongBreakTime * 60;
  document.cookie = `workTime=${rawWorkTime}`;
  document.cookie = `shortBreakTime=${rawShortBreakTime}`;
  document.cookie = `longBreakTime=${rawLongBreakTime}`;
  totalTime = workTime;
  isInit = true;
}

// use to print the time
const setTime = time => {
  let minute = Math.floor(time / 60);
  let second = time % 60;
  // if minute or second missed the front zero, add one more 0 to front
  if (minute < 10) {
    if (second < 10) {
      timerTime.innerHTML = `0${minute}:0${second}`;
      document.title = `0${minute}:0${second} ${status}`;
    } else {
      timerTime.innerHTML = `0${minute}:${second}`;
      document.title = `0${minute}:${second} ${status}`;
    }
  } else {
    if (second < 10) {
      timerTime.innerHTML = `${minute}:0${second}`;
      document.title = `${minute}:0${second} ${status}`;
    } else {
      timerTime.innerHTML = `${minute}:${second}`;
      document.title = `${minute}:${second} ${status}`;
    }
  }
}

// use to print messsage that in message box
const messageBoxPinter = (statusMessage, duration) => {
  statusBox.innerHTML = `status: ${statusMessage}`;
  durationBox.innerHTML = `duration: ${duration}`;
}

// count time
const secondCount = () => {
  totalTime--;
  setTime(totalTime);
  /*
    run long break when user have done 3 duration,
    run shrot break when user have not done 3 duration
    continue run work when break end
  */
  // start short break
  if (totalTime === 0 && isWork && duration < 3) {
    totalTime = shortBreakTime;
    isWork = false;
    duration++;
    sound.play();
    status = 'short break';
    messageBoxPinter(status, duration);
  // start long break
  } else if (totalTime === 0 && isWork && duration === 3) {
    totalTime = longBreakTime;
    isWork = false;
    duration = 0;
    sound.play();
    status = 'long break';
    messageBoxPinter(status, duration);
  // start work
  } else if (totalTime === 0) {
    totalTime = workTime;
    isWork = true;
    sound.play();
    status = 'work';
    messageBoxPinter(status, duration);
  }
}

// start timer
startButton.addEventListener('click', () => {
  if (!isInit) {
    init();
  }
  if (!isStart) {
    runTime = setInterval(secondCount, 1000);
    isStart = true;
    isStop = false;
  }
})
// use enter to start
window.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      startButton.click();
    }
});

// stop timer
stopButton.addEventListener('click', () => {
  if (!isStop) {
    clearInterval(runTime);
    isStart = false;
    isStop = true;
  }

})

// use to reset timer
resetTimer.addEventListener('click', () => {
  location.reload();
})

// use to adjust the minute
addOneMinute.addEventListener('click', () => {
  totalTime+= 60;
  setTime(totalTime);
})
