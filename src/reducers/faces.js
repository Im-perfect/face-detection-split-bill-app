const reducer = (state = null, action = {}) => {
  switch (action.type) {
    case "DETECT_FACES":
      return action.payload;

    default:
      return state;
  }
};

export default reducer;
