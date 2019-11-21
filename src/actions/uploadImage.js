const request = require("superagent");

export const uploadImageUrl = imageUrl => {
  request
    .post(process.env.REACT_APP_IMGUR_BASE_URL)
    .set("Authorization", process.env.REACT_APP_IMGUR_CLIENT_ID)
    .send({
      image: imageUrl
    })
    .then(res => {
      return res.body.data.link;
    });
};

export const uploadImageBinary = imageFile => {
  const data = new FormData();
  data.append("image", imageFile);
  data.append("type", "file");
  console.log(process.env.REACT_APP_IMGUR_CLIENT_ID);
  return new Promise((resolve, reject) => {
    request
      .post(process.env.REACT_APP_IMGUR_BASE_URL)
      .set("Authorization", process.env.REACT_APP_IMGUR_CLIENT_ID)
      .send(data)
      .then(res => {
        resolve({
          link: res.body.data.link,
          deleteHash: res.body.data.deletehash
        });
      });
  });
};

export const uploadImageBase64 = imageFile => {
  const data = new FormData();
  data.append("image", imageFile);
  data.append("type", "base64");
  return new Promise((resolve, reject) => {
    request
      .post(process.env.REACT_APP_IMGUR_BASE_URL)
      .set("Authorization", process.env.REACT_APP_IMGUR_CLIENT_ID)
      .send(data)
      .then(res => {
        resolve({
          link: res.body.data.link,
          deleteHash: res.body.data.deletehash
        });
      });
  });
};

export const deleteImage = imageDeleteHash => {
  request
    .delete(`https://api.imgur.com/3/image/${imageDeleteHash}`)
    .set("Authorization", process.env.REACT_APP_IMGUR_CLIENT_ID)
    .then(res => {});
};
