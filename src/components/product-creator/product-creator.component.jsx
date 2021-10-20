import React, { createRef } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import Alert from "../alert/alert.component";

import LISTS from "../menu/menu.lists";

class ProductCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      originalName: "",
      coverPhoto: "default.png",
      isLoadedPhoto: false,
      isDeactivated: false,
      price: 0,
      originalPrice: 0,
      category: LISTS.drinks.typeOfProduct,
      originalCategory: LISTS.drinks.typeOfProduct,
    };

    this.photoRef = createRef();
  }

  async componentDidMount() {
    try {
      if (this.props.itemId) {
        let productData = await axios({
          method: "GET",
          url: `/api/products/${this.props.itemId}`,
        });

        productData = productData.data.data.data;

        this.setState({
          name: productData.name,
          originalName: productData.name,
          coverPhoto: productData.coverPhoto,
          isDeactivated: productData.isDeactivated,
          price: productData.price,
          originalPrice: productData.price,
          category: productData.category,
          originalCategory: productData.category,
        });
      }
    } catch (error) {}
  }

  changeHandler = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  photoHandler = (event) => {
    event.preventDefault();
    const { files } = event.target;

    const isLoadedPhoto = files.length > 0;
    this.setState({ isLoadedPhoto });
  };

  openFileDialog = () => {
    this.photoRef.current.click();
  };

  resetPhoto = () => {
    this.photoRef.current.value = null;
    this.setState({
      isLoadedPhoto: false,
    });
  };

  clearPhoto = () => {
    this.setState({
      coverPhoto: "default.png",
    });
  };

  createFormData = () => {
    const {
      name,
      originalName,
      isLoadedPhoto,
      price,
      originalPrice,
      category,
      originalCategory,
    } = this.state;
    const data = new FormData();
    if (!name) {
      return null;
    }
    if (!this.props.itemId) {
      data.append("name", name);
      data.append("price", price);
      data.append("category", category);
    } else {
      if (name !== originalName) {
        data.append("name", name);
      }
      if (price !== originalPrice) {
        data.append("price", price);
      }
      if (category !== originalCategory) {
        data.append("category", category);
      }
    }

    if (isLoadedPhoto) {
      data.append("coverPhoto", this.photoRef.current.files[0]);
    }

    let dataLength = 0;

    for (let i of data.keys()) {
      dataLength++;
    }
    console.log(dataLength);
    if (!dataLength) {
      return null;
    }

    return data;
  };

  sendData = async () => {
    const data = this.createFormData();
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    let product;
    if (!data) {
      return;
    }
    try {
      if (this.props.itemId) {
        product = await axios({
          method: "PATCH",
          url: `/api/products/${this.props.itemId}`,
          headers,
          data,
        });
        product = product.data.data.data;
      } else {
        product = await axios({
          method: "POST",
          url: `/api/products`,
          headers,
          data,
        });
        product = product.data.data.data;
        this.props.itemId = product._id;
      }

      if (!product) {
        return;
      }
      this.setState(
        {
          name: product.name,
          originalName: product.name,
          coverPhoto: product.coverPhoto,
          templateId: product._id,
          category: product.category,
          originalCategory: product.category,
          price: product.price,
          originalPrice: product.price,
          isLoadedPhoto: false,
        },
        () => (this.photoRef.current.value = null)
      );

      await this.props.refresh(this.props.list);
    } catch (error) {}
  };

  toggleDeactivation = async () => {
    try {
      const { itemId, list } = this.props;

      if (itemId) {
        const product = await axios({
          method: "PATCH",
          url: `/api/products/toggle-activation-status/${itemId}`,
        });

        this.setState({
          isDeactivated: product.data.data.data.isDeactivated,
        });

        this.props.refresh(list);
      }
    } catch (error) {}
  };

  render() {
    const { name, coverPhoto, isLoadedPhoto, category, isDeactivated, price } =
      this.state;

    const { itemId, close } = this.props;
    const photoUrl = !isLoadedPhoto
      ? `/uploads/products/${coverPhoto}`
      : URL.createObjectURL(this.photoRef.current.files[0]);
    return (
      <Alert close={close} closeBtn={true}>
        <div className="wrapper list-scroll" style={{ maxHeight: "80vh" }}>
          <div className="wrapper">
            <div className="flex-column">
              <Form.Label>Nazwa:</Form.Label>
              <Form.Control
                type="input"
                value={name}
                name="name"
                onChange={this.changeHandler}
              />
              <Form.Control
                type="file"
                name="coverPhoto"
                ref={this.photoRef}
                onChange={this.photoHandler}
                hidden
              />
            </div>

            <div className="flex-column">
              <img className="item-photo round-border" src={photoUrl} alt="" />
              <div className="flex-row centered-content">
                {!isLoadedPhoto && (
                  <Button
                    className="small-margin"
                    onClick={this.openFileDialog}
                  >
                    Zmień
                  </Button>
                )}
                {!isLoadedPhoto ? (
                  <Button
                    className="small-margin"
                    variant="danger"
                    onClick={this.clearPhoto}
                  >
                    Kasuj
                  </Button>
                ) : (
                  <Button
                    className="small-margin"
                    variant="danger"
                    onClick={this.resetPhoto}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-column">
              <h3>Kategoria:</h3>
              <div className="flex-row">
                <Button
                  value="Napoje"
                  name="category"
                  onClick={this.changeHandler}
                  variant={category === "Napoje" ? "info" : "primary"}
                >
                  Napoje
                </Button>
                <Button
                  value="Sosy"
                  name="category"
                  onClick={this.changeHandler}
                  variant={category === "Sosy" ? "info" : "primary"}
                >
                  Sosy
                </Button>
              </div>
            </div>
            <div className="flex-column">
              <h3>Cena:</h3>
              <Form.Control
                name="price"
                value={price}
                onChange={this.changeHandler}
              />
            </div>
            {itemId && (
              <div className="flex-row centered-content">
                <Button
                  variant={isDeactivated ? "primary" : "danger"}
                  onClick={this.toggleDeactivation}
                >
                  {isDeactivated ? "Aktywuj" : "Dezaktywuj"}
                </Button>
              </div>
            )}
            <div className="flex-row">
              <Button size="lg" onClick={this.sendData}>
                Zapisz zmiany
              </Button>
              <Button size="lg" variant="danger" onClick={close}>
                Zamknij
              </Button>
            </div>
          </div>
        </div>
      </Alert>
    );
  }
}

export default ProductCreator;
