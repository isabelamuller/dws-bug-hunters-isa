const run = async (game) => {
  await game();
  process.stdin.pause();
};

export default run;
