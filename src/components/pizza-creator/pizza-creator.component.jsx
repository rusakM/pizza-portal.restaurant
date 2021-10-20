import React, { createRef } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import Alert from "../alert/alert.component";
import formatPrice from "../../utils/formatPrice";

import LISTS from "../menu/menu.lists";

class PizzaCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredientsList: [],
      ingredients: [],
      availableIngredients: [],
      originalIngredients: [],
      name: "",
      originalName: "",
      smallPizza: null,
      mediumPizza: null,
      largePizza: null,
      coverPhoto: "default.png",
      isLoadedPhoto: false,
      templateId: null,
      isDeactivated: false,
    };

    this.photoRef = createRef();
  }

  async componentDidMount() {
    try {
      if (this.props.itemId) {
        let templateData = await axios({
          method: "GET",
          url: `/api/pizzas/templates/${this.props.itemId}`,
        });
        let ingredients = await axios({
          method: "GET",
          url: "/api/supplies",
        });
        templateData = templateData.data.data.data;
        let availableIngredients = ingredients.data.data.data;
        let usedIngredients = templateData.smallPizza.ingredients;
        for (let i = 0; i < usedIngredients.length; i++) {
          availableIngredients = availableIngredients.filter(
            (item) => item._id !== usedIngredients[i]._id
          );
        }

        this.setState({
          smallPizza: templateData.smallPizza,
          mediumPizza: templateData.mediumPizza,
          largePizza: templateData.largePizza,
          name: templateData.name,
          originalName: templateData.name,
          coverPhoto: templateData.coverPhoto,
          ingredientsList: ingredients.data.data.data,
          availableIngredients,
          ingredients: usedIngredients,
          originalIngredients: [...usedIngredients],
          templateId: templateData._id,
          isDeactivated: templateData.isDeactivated,
        });
      } else {
        let ingredients = await axios({
          method: "GET",
          url: "/api/supplies",
        });

        const ingredientsList = ingredients.data.data.data;

        this.setState({
          ingredientsList,
          availableIngredients: ingredientsList,
        });
      }
    } catch (error) {}
  }

  calculatePrice = (basePrice) => {
    if (this.state.ingredients.length > 0) {
      return (
        basePrice +
        this.state.ingredients
          .map((item) => item.price)
          .reduce((total, val) => total + val)
      );
    }
    return basePrice;
  };

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

  selectItem = (item) => {
    const { ingredients } = this.state;

    ingredients.unshift(item);

    this.setState({
      ingredients,
      availableIngredients: this.state.availableIngredients.filter(
        (i) => i._id !== item._id
      ),
    });
  };

  removeItem = (item) => {
    const { availableIngredients } = this.state;
    availableIngredients.unshift(item);
    this.setState({
      availableIngredients,
      ingredients: this.state.ingredients.filter((i) => i._id !== item._id),
    });
  };

  createFormData = () => {
    const {
      name,
      originalName,
      ingredients,
      originalIngredients,
      isLoadedPhoto,
    } = this.state;
    const data = new FormData();
    if (!name) {
      return null;
    }
    if (!this.props.itemId) {
      data.append("name", name);
    } else {
      if (name !== originalName) {
        data.append("name", name);
      }
    }
    if (
      JSON.stringify(ingredients) !== JSON.stringify(originalIngredients) ||
      !this.props.itemId
    ) {
      data.append("ingredients", ingredients.map((item) => item.id).join(","));
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
    let template;
    if (!data) {
      return;
    }
    try {
      if (this.props.itemId) {
        template = await axios({
          method: "PATCH",
          url: `/api/pizzas/templates/update/${this.props.itemId}`,
          headers,
          data,
        });
        template = template.data.data.data;
      } else {
        template = await axios({
          method: "POST",
          url: `/api/pizzas/templates/create`,
          headers,
          data,
        });
        template = template.data.data.data;
        this.props.itemId = template._id;
      }

      if (!template) {
        return;
      }
      this.setState(
        {
          smallPizza: template.smallPizza,
          mediumPizza: template.mediumPizza,
          largePizza: template.largePizza,
          name: template.name,
          originalName: template.name,
          coverPhoto: template.coverPhoto,
          templateId: template._id,
          isLoadedPhoto: false,
        },
        () => (this.photoRef.current.value = null)
      );

      await this.props.refresh(LISTS.templates.name);
    } catch (error) {}
  };

  toggleDeactivation = async () => {
    try {
      const { templateId } = this.state;

      if (templateId) {
        const template = await axios({
          method: "PATCH",
          url: `/api/pizzas/templates/toggle-activation-status/${templateId}`,
        });

        this.setState({
          isDeactivated: template.data.data.data.isDeactivated,
        });

        this.props.refresh(LISTS.templates.name);
      }
    } catch (error) {}
  };

  render() {
    const {
      name,
      coverPhoto,
      isLoadedPhoto,
      ingredients,
      availableIngredients,
      isDeactivated,
    } = this.state;
    const { itemId, close } = this.props;
    const photoUrl = !isLoadedPhoto
      ? `/uploads/pizzas/${coverPhoto}`
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
            {availableIngredients.length > 0 && (
              <div className="default-margin">
                <div className="round-border default-padding">
                  <h5>Dostępne składniki:</h5>
                  {availableIngredients.map((item) => (
                    <Button
                      onClick={() => this.selectItem(item)}
                      className="small-margin"
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {ingredients.length > 0 && (
              <div className="default-margin">
                <div className="round-border default-padding">
                  <h5>Wybrane składniki:</h5>
                  {ingredients.map((item) => (
                    <Button
                      onClick={() => this.removeItem(item)}
                      className="small-margin"
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex-column">
              <h3>Ceny pizzy:</h3>
              <div className="flex-row">
                <div className="flex-column">
                  <h5>24cm</h5>
                  <p>{formatPrice(this.calculatePrice(15))}</p>
                </div>
                <div className="flex-column">
                  <h5>32cm</h5>
                  <p>{formatPrice(this.calculatePrice(19))}</p>
                </div>
                <div className="flex-column">
                  <h5>42cm</h5>
                  <p>{formatPrice(this.calculatePrice(23))}</p>
                </div>
              </div>
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

export default PizzaCreator;
