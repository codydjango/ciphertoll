import eventManager from './eventManager';
import { ITown } from './towns/town.data';

export class Menus {
  constructor() {
    eventManager.subscribe('display-inventory', this.renderInventory, this);
    eventManager.subscribe('display-mined', this.renderMined, this);
    eventManager.subscribe('display-town', this.renderTown, this);
    eventManager.subscribe('hide-town', this.clearTown, this);
  }

  public renderInventory(inventoryObject: any) {
    let str = inventoryObject.map((item: any) => item.name).join('<br>');
    str = 'INVENTORY <br><br>' + str;
    this.set(str, 'inventory-status');
  }

  public renderMined(minedElementsObject: any) {
    let str = this.cleanJSONString(JSON.stringify(minedElementsObject));
    str = 'PARTICLES MINED <br><br>' + str;
    this.set(str, 'mining-status');
  }

  public renderTown(
    townDataObject: ITown,
    menuItemIndex: number,
    description: string,
  ) {
    const { name, locations } = townDataObject;
    let str = locations
      .map((location, i) => {
        const { name } = location;
        if (i == menuItemIndex) {
          if (description) {
            return `> ${name}<br>&nbsp;&nbsp;&nbsp;&nbsp;${description}`;
          } else {
            return `> ${name}`;
          }
        } else {
          return `&nbsp; ${name}`;
        }
      })
      .join('<br>');

    str = name.toUpperCase() + '<br><br>' + str;
    this.set(str, 'town-menu');
  }

  public clearTown() {
    this.set('', 'town-menu');
  }

  public cleanJSONString(str: any) {
    str = str.replace(/"/g, '');
    str = str.replace(/:/g, ' ');
    str = str.replace(/{/g, '');
    str = str.replace(/}/g, '');
    str = str.replace(/,/g, '<br>');

    return str;
  }

  public set(description: string, elementID: string, delay = 0) {
    const el: HTMLElement = document.getElementById(elementID)!; // ! forces compiler to accept non-null reference
    window.setTimeout(() => {
      el.innerHTML = description;
    }, delay);
  }
}
