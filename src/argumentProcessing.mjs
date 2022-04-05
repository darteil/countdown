const argumentProcessing = (arg) => {
  const args = arg.slice(2);
  const error = "invalid args";
  const result = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  const numericNoSymbols = /^[0-9]+$/;

  if (args.length !== 3) return error;

  if (
    !numericNoSymbols.test(args[0]) ||
    !numericNoSymbols.test(args[1]) ||
    !numericNoSymbols.test(args[2])
  )
    return error;

  if (+args[0] > 22 || +args[1] > 60 || +args[2] > 60) return error;

  result.hours = +args[0];
  result.minutes = +args[1];
  result.seconds = +args[2];

  return result;
};

export default argumentProcessing;
