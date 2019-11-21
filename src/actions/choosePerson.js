export const getMax = (faces, selectedEmotion) => {
  if (faces.length > 1) {
    const maxEmotionPeople = faces.reduce((maxEmotion, face, currentIndex) => {
      if (currentIndex === 0) {
        maxEmotion.push(face);
        return maxEmotion;
      }
      if (
        face.faceAttributes.emotion[selectedEmotion] ===
        maxEmotion[0].faceAttributes.emotion[selectedEmotion]
      ) {
        maxEmotion.push(face);
      } else if (
        face.faceAttributes.emotion[selectedEmotion] >
        maxEmotion[0].faceAttributes.emotion[selectedEmotion]
      ) {
        maxEmotion.push(face);
        maxEmotion.shift();
      }
      return maxEmotion;
    }, []);
    console.log("maxEmotionPeople", maxEmotionPeople);
    if (maxEmotionPeople.length > 1) {
      return maxEmotionPeople[
        Math.floor(Math.random() * maxEmotionPeople.length)
      ].faceId;
    }
    return maxEmotionPeople[0].faceId;
  }
};

export const getPayForAll = (faces, luckyId) => {
  if (faces.length > 1) {
    const rest = faces.filter(face => face.faceId !== luckyId);
    return rest[Math.floor(Math.random() * rest.length)].faceId;
  }
  return luckyId;
};
