const request = require("request");
const { deleteImage } = require("./uploadImage");

export const faceDetect = (url, deleteHash) => dispatch => {
 
  const imageUrl = url;

  // Request parameters.
  const params = {
    returnFaceId: "true",
    returnFaceLandmarks: "false",
    returnFaceAttributes: `age,smile,emotion,blur`
  };

  const options = {
    uri: process.env.REACT_APP_FACE_API_BASE_URI,
    qs: params,
    body: `{"url":"${imageUrl}"}`,
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": process.env.REACT_APP_FACE_API_SUBSCRIPTION_KEY
    }
  };

  return new Promise((resolve, reject)=>{
      request.post(options, (error, response, body) => {
    if (error) {
      console.log("Error: ", error);
      return;
    }

    dispatch({
      type: "DETECT_FACES",
      payload: JSON.parse(body)
    });

    resolve(JSON.parse(body))

    if (deleteHash) {
      deleteImage(deleteHash);
    }
  });
  })



};

export const caculateFaceRectangle = (face, imageDimensions) => {
  const faceRectangle = face.faceRectangle;

  const { naturalDimensions, offsetDimensions } = imageDimensions;
  const scale = {
    width: offsetDimensions.width / 400,
    height: offsetDimensions.height / 300
  };
  const location = {
    width:
      Math.round(
        (faceRectangle.width / naturalDimensions.width) * 100 * scale.width
      ) + "%",
    height:
      Math.round(
        (faceRectangle.height / naturalDimensions.height) * 100 * scale.height
      ) + "%",
    top:
      Math.round(
        (faceRectangle.top / naturalDimensions.height) * 100 * scale.height
      ) + "%",
    left:
      Math.round(
        ((faceRectangle.left / naturalDimensions.width) * scale.width +
          (1 - offsetDimensions.width / 400) / 2) *
          100
      ) + "%"
  };
  return location;
};
