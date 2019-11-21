import React, { Component } from "react";
import { connect } from "react-redux";

import imagePlaceholder from "../facePlaceholder.jpg";
import { faceDetect, caculateFaceRectangle } from "../actions/facedetection";
import { uploadImageBinary, uploadImageBase64 } from "../actions/uploadImage";
import { getMax, getPayForAll } from "../actions/choosePerson";
import PaymentForm from "./PaymentForm";
import AttributeSelection from "./AttributeSelection";

export class ImageUploader extends Component {
  constructor(props) {
    super(props);
    this.video = React.createRef();
    this.canvas = React.createRef();
  }

  state = {
    imageUrl: "",
    imageSrc: imagePlaceholder,
    imageFile: { name: "" },
    stream: null,
    paymentData: {
      iban: "",
      name: "",
      amount: "",
      qrcode: "",
      selectedBank: "abn"
    },
    uploadMethod: "url",
    faceChosen: {
      luckyId: null,
      payForAllId: null
    },
    selectedAttribute: "happiness"
  };

  imageChooseHandler = event => {
    if (this.state.uploadMethod === "url") {
      this.setState({
        imageUrl: event.target.value
      });
    } else if (this.state.uploadMethod === "browse") {
      this.setState({
        imageFile: event.target.files[0]
      });
    }
  };

  attributeOnChange = event => {
    this.setState({ selectedAttribute: event.target.value });
  };

  submitHandler = event => {
    event.preventDefault();
    if (this.state.uploadMethod === "url") {
      this.props.faceDetect(this.state.imageUrl).then(res => {
        const luckyId = getMax(res, this.state.selectedAttribute);
        this.setState({
          faceChosen: {
            luckyId,
            payForAllId: getPayForAll(res, luckyId)
          }
        });
      });
      this.setState({
        imageSrc: this.state.imageUrl,
        imageUrl: ""
      });
    } else if (this.state.uploadMethod === "browse") {
      uploadImageBinary(this.state.imageFile).then(res => {
        this.setState({
          imageSrc: res.link
        });

        this.props.faceDetect(res.link, res.deleteHash).then(res => {
          const luckyId = getMax(res, this.state.selectedAttribute);
          this.setState({
            faceChosen: {
              luckyId,
              payForAllId: getPayForAll(res, luckyId)
            }
          });
        });
      });
    } else if (this.state.uploadMethod === "camera") {
      if (this.state.dataURL) {
        uploadImageBase64(this.state.dataURL.split(",")[1]).then(res => {
          this.setState({
            imageSrc: res.link
          });
          this.props.faceDetect(res.link, res.deleteHash).then(res => {
            const luckyId = getMax(res, this.state.selectedAttribute);
            this.setState({
              faceChosen: {
                luckyId,
                payForAllId: getPayForAll(res, luckyId)
              }
            });
          });
        });
      }
    }
  };

  imgOnLoad = ({ target: img }) => {
    this.setState({
      offsetDimensions: {
        width: img.offsetWidth,
        height: img.offsetHeight
      },
      naturalDimensions: {
        width: img.naturalWidth,
        height: img.naturalHeight
      }
    });
  };

  startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(stream => {
        this.video.current.srcObject = stream;
        this.setState({ stream });
      });
  };

  closeCamera = () => {
    this.state.stream.getTracks().forEach(track => track.stop());
  };

  takePhoto = () => {
    const context = this.canvas.current.getContext("2d");
    context.drawImage(
      this.video.current,
      0,
      0,
      this.canvas.current.width,
      this.canvas.current.height
    );
    const dataURL = this.canvas.current.toDataURL("image/jpeg", 1.0);
    this.setState({
      dataURL
    });
  };

  paymentOnChange = event => {
    console.log(event.target.name);
    this.setState({
      paymentData: {
        ...this.state.paymentData,
        [event.target.name]: event.target.value
      }
    });
  };

  paymentOnSubmit = event => {
    event.preventDefault();
    const { name, iban, amount, selectedBank } = this.state.paymentData;
    const splitAmount =
      this.props.faces && this.props.faces.length > 1
        ? amount / (this.props.faces.length - 1)
        : amount;
    this.setState({
      paymentData: {
        ...this.state.paymentData,
        qrcode: `https://qrcode.tec-it.com/API/QRCode?data=BCD%0a001%0a1%0aSCT%0a${selectedBank}%0a${name
          .trim()
          .split(" ")
          .join("+")}%0a${iban}%0aEUR${splitAmount}&backcolor=%23ffffff`
      }
    });
  };

  render() {
    const { faces } = this.props;

    return (
      <div>
        <div id="intro">
          <h1>
            Split your bill with<span> fun</span>
          </h1>
        </div>
        <div className="intro-bottom" id="step1"></div>
        <div className="align-center section">
          <h2 className="highlight">Upload your image</h2>
          <h4>Choose a method</h4>
        </div>

        <div className="btn-group">
          <button
            onClick={() => {
              this.setState({ uploadMethod: "url" });
            }}
            className={this.state.uploadMethod === "url" ? "active" : null}
          >
            Via URL
          </button>
          <button
            onClick={() => {
              this.setState({ uploadMethod: "browse" });
            }}
            className={this.state.uploadMethod === "browse" ? "active" : null}
          >
            From computer
          </button>
          <button
            onClick={() => {
              this.setState({ uploadMethod: "camera" });
            }}
            className={this.state.uploadMethod === "camera" ? "active" : null}
          >
            Take a photo
          </button>
        </div>
        <div>
          <p>
            Person with <span style={{ color: "green" }}>GREEN</span> frame
            doesn't need to pay.
          </p>
          <p>
            Person with <span style={{ color: "red" }}>RED</span> frame pays the
            bill and collects payments from others.
          </p>
        </div>
        <div className="image-result-container">
          <img src={this.state.imageSrc} alt="faces" onLoad={this.imgOnLoad} />
          {faces &&
            faces.length > 1 &&
            faces.map(face => {
              return (
                <div
                  key={face.faceId}
                  className={`face-rectangle ${
                    face.faceId === this.state.faceChosen.luckyId
                      ? "green-border"
                      : face.faceId === this.state.faceChosen.payForAllId
                      ? "red-border"
                      : ""
                  }`}
                  style={{
                    ...caculateFaceRectangle(face, this.state)
                  }}
                ></div>
              );
            })}
        </div>
        <div>
          {this.state.uploadMethod === "camera" ? (
            <div>
              <button onClick={this.startCamera} className="button small">
                Start webcam
              </button>
              <div className="camera-area">
                <div className="camera-buttons">
                  <button
                    onClick={this.takePhoto}
                    className="button extra-small primary"
                  >
                    Take a photo
                  </button>
                  <button
                    onClick={this.closeCamera}
                    className="button extra-small"
                  >
                    Close webcam
                  </button>
                </div>
                <video className="camera" autoPlay ref={this.video}></video>

                <canvas
                  width="400"
                  height="300"
                  className="preview-canvas"
                  ref={this.canvas}
                ></canvas>
              </div>
            </div>
          ) : this.state.uploadMethod === "browse" ? (
            <input type="file" onChange={this.imageChooseHandler}></input>
          ) : (
            <input
              type="text"
              placeholder="Image URL"
              onChange={this.imageChooseHandler}
              value={this.state.imageUrl}
            ></input>
          )}
          <AttributeSelection
            onChange={this.attributeOnChange}
            selectedAttribute={this.state.selectedAttribute}
          />
          <input
            type="submit"
            onClick={this.submitHandler}
            value="Upload image"
          ></input>
        </div>
        <div id="step2">
          <div className="align-center section">
            <h2 className="highlight">Split the bill</h2>
            <h4>Get payment request QR-code</h4>
          </div>
          <div className="payment-area">
            <PaymentForm
              onChange={this.paymentOnChange}
              onSubmit={this.paymentOnSubmit}
              paymentData={this.state.paymentData}
            />
            <div className="qr-code">
              {this.state.paymentData.qrcode ? (
                <img
                  src={this.state.paymentData.qrcode}
                  width="200"
                  alt="qr-code"
                />
              ) : (
                "Fill in information to generate your QR-code. Then scan with your mobile bank app."
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ faces }) => ({ faces });

const mapDispatchToProps = {
  faceDetect
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageUploader);
