// This avoids a memory leak warning that's occasionally breaking builds
// Here's an example: https://circleci.com/gh/mcdpartners/react-bank/1037
// This workaround is per https://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected
// Not worried about a potential memory leak since it's just a Docker container that's
// torn down after the CI build is completed.
// Per here, 0 removes the limit: https://nodejs.org/dist/latest-v8.x/docs/api/events.html#events_emitter_setmaxlisteners_n
process.setMaxListeners(0);
