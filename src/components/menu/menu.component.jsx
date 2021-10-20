import React from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

import MenuItem from "../menu-item/menu-item.component";
import PizzaCreator from "../pizza-creator/pizza-creator.component";
import ProductCreator from "../product-creator/product-creator.component";
import LISTS from "./menu.lists";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isVisibleError: false,
      errorDescription: "",
      activeList: LISTS.templates.name,
      isVisiblePizzaEditor: false,
      pizzaEditorId: null,
      isVisibleItemEditor: false,
      itemEditorId: null,
    };
  }

  async componentDidMount() {
    try {
      const templates = await axios({
        method: "GET",
        url: LISTS.templates.url,
      });
      this.setState({
        items: templates.data.data.data,
      });
    } catch (error) {
      this.setState({
        isVisibleError: true,
        errorDescription: "Błąd pobierania danych",
      });
    }
  }

  getData = async (list) => {
    try {
      const items = await axios({
        method: "GET",
        url: LISTS[list].url,
      });

      this.setState({
        items: items.data.data.data,
        activeList: list,
      });
    } catch (error) {}
  };

  mapItems = (items) => {
    for (let i = 0; i < items.length; i++) {
      items[i].num = i;
    }

    return items;
  };

  openEditor = (id) => {
    const { activeList } = this.state;
    let newState = {
      isVisiblePizzaEditor: true,
      pizzaEditorId: id,
    };
    if (activeList !== LISTS.templates.name) {
      newState = {
        itemEditorId: id,
        isVisibleItemEditor: true,
      };
    }
    this.setState({ ...newState });
  };

  closeEditor = () => {
    this.setState({
      isVisiblePizzaEditor: false,
      isVisibleItemEditor: false,
      pizzaEditorId: null,
      itemEditorId: null,
    });
  };

  render() {
    const {
      items,
      activeList,
      isVisiblePizzaEditor,
      pizzaEditorId,
      isVisibleItemEditor,
      itemEditorId,
    } = this.state;
    const itemsActive = items.filter((item) => !item.isDeactivated);
    const itemsInactive = items.filter((item) => item.isDeactivated);
    return (
      <div className="wrapper">
        <div className="flex-row">
          <Button onClick={() => this.getData(LISTS.templates.name)}>
            Pizze
          </Button>
          <Button onClick={() => this.getData(LISTS.drinks.name)}>
            Napoje
          </Button>
          <Button onClick={() => this.getData(LISTS.sauces.name)}>Sosy</Button>
        </div>
        <div className="wrapper">
          <Button size="lg" onClick={() => this.openEditor(null)}>
            Dodaj nowy
          </Button>
        </div>
        {itemsActive.length > 0 && (
          <div className="wrapper">
            <h3>Elementy aktywne:</h3>
            <div className="wrapper">
              {itemsActive.map((item) => (
                <MenuItem
                  open={() => this.openEditor(item._id)}
                  key={item._id}
                  item={item}
                  category={LISTS[activeList].category}
                />
              ))}
            </div>
          </div>
        )}
        {itemsInactive.length > 0 && (
          <div className="wrapper" style={{ clear: "both" }}>
            <h3>Elementy nieaktywne:</h3>
            <div className="wrapper">
              {itemsInactive.map((item) => (
                <MenuItem
                  open={() => this.openEditor(item._id)}
                  key={item._id}
                  item={item}
                  category={LISTS[activeList].category}
                />
              ))}
            </div>
          </div>
        )}
        {isVisiblePizzaEditor && (
          <PizzaCreator
            itemId={pizzaEditorId}
            close={this.closeEditor}
            refresh={this.getData}
          />
        )}
        {isVisibleItemEditor && (
          <ProductCreator
            itemId={itemEditorId}
            close={this.closeEditor}
            refresh={this.getData}
            list={activeList}
          />
        )}
      </div>
    );
  }
}

export default Menu;
