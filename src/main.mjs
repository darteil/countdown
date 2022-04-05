import readline from "readline";
import argumentProcessing from "./argumentProcessing.mjs";
import { timeUpText, numbers } from "./ascii.mjs";

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const duration = argumentProcessing(process.argv);
let tickForFlashingText = 0; // 0 or 1

if (duration === "invalid args") {
  process.stdout.write(duration);
  process.exit();
}

const printTime = (hours, minutes, seconds) => {
  const text = hours + minutes + seconds;
  const splitText = text.split("");

  const asciiText = { firstLine: [], secondLine: [], thirdLine: [] };

  splitText.forEach((value, index) => {
    if (index === 1 || index === 3) {
      asciiText.firstLine = asciiText.firstLine.concat(numbers[value][0], " ");
      asciiText.secondLine = asciiText.secondLine.concat(
        numbers[value][1],
        "╹"
      );
      asciiText.thirdLine = asciiText.thirdLine.concat(numbers[value][2], "╹");
    } else {
      asciiText.firstLine = asciiText.firstLine.concat(numbers[value][0]);
      asciiText.secondLine = asciiText.secondLine.concat(numbers[value][1]);
      asciiText.thirdLine = asciiText.thirdLine.concat(numbers[value][2]);
    }
  });

  asciiText.firstLine.forEach((val) => {
    process.stdout.write(val);
  });
  process.stdout.write("\n");
  asciiText.secondLine.forEach((val) => {
    process.stdout.write(val);
  });
  process.stdout.write("\n");
  asciiText.thirdLine.forEach((val) => {
    process.stdout.write(val);
  });
  process.stdout.write("\n");
  process.stdout.write("press q to exit...");
};

const printTimeUpText = () => {
  timeUpText.forEach((arr) => {
    arr.forEach((value) => {
      if (tickForFlashingText === 0) {
        process.stdout.write("\x1b[34m" + value + "\x1b[89m");
      }
      if (tickForFlashingText === 1) {
        process.stdout.write("\x1b[104m" + value + "\x1b[49m");
      }
    });
    process.stdout.write("\n");
  });
  tickForFlashingText === 0
    ? (tickForFlashingText = 1)
    : (tickForFlashingText = 0);
  process.stdout.write("\x1b[0m");
  process.stdout.write("press q to exit...");
};

const makeMeTwoDigits = (n) => {
  return (n < 10 ? "0" : "") + n;
};

const clear = () => {
  process.stdout.clearLine(0);

  const countOfLines = 3;

  for (let i = 0; i < countOfLines; i++) {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(0);
  }
  process.stdout.cursorTo(0);
};

const countdown = (init, timeEnd) => {
  if (!init) {
    clear();
  }

  const difference = timeEnd - +new Date();

  if (difference > 0) {
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    printTime(
      makeMeTwoDigits(hours),
      makeMeTwoDigits(minutes),
      makeMeTwoDigits(seconds)
    );
  } else {
    printTimeUpText();
  }
};

const disableCursorCommand = "\x1B[?25l";
const enableCursorCommand = "\x1B[?25h";

process.stdout.write(disableCursorCommand);

process.on("SIGINT", () => {
  process.stdout.write(enableCursorCommand);
  clear();
  process.exit(0);
});

process.stdin.on("keypress", (str, key) => {
  if (key.name === "q") {
    process.stdout.write(enableCursorCommand);
    clear();
    process.exit(0);
  }
});

const finishTime = new Date();

finishTime.setSeconds(finishTime.getSeconds() + duration.seconds);
finishTime.setMinutes(finishTime.getMinutes() + duration.minutes);
finishTime.setHours(finishTime.getHours() + duration.hours);

countdown(true, finishTime);
setInterval(() => {
  countdown(false, finishTime);
}, 1000);
