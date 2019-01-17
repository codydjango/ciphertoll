import Utility from './Utility';

interface ICoordinates {
  x: number;
  y: number;
}

class Renderable {
  // generalized render functions for Scenery, Character

  public layer: any;

  public setLayer(layer: string | any) {
    this.layer = layer;
  }

  public getLayer() {
    return this.layer;
  }

  public getCSSHeightAndWidth() {
    const el = document.querySelector('.unit')!; // force non-null
    const style = window.getComputedStyle(el);
    const width: number = Utility.stringToNumber(
      style.getPropertyValue('width'),
    );
    const height: number = Utility.stringToNumber(
      style.getPropertyValue('height'),
    );
    return { width, height };
  }

  public getCSSCoordinates({ x, y }: ICoordinates) {
    const css = this.getCSSHeightAndWidth();
    // +1 to gridIndices prevents left-side bug in movement display,
    // but shifts the character's display grid over to the left and down ...
    // possibly try shifting entire grid over ???
    // so that we're not mulitplying the css.width etc by ZERO
    const left = (x + 1) * css.height;
    const top = (y + 1) * css.width;
    console.log(left, top);
    return { left, top };
  }

  public renderSpan(unit: any) {
    let cls = '';
    let element = '&nbsp;';
    let style = '';
    if (unit) {
      cls = unit.cls;
      element = unit.element;
    }

    if (unit.top && unit.left) {
      style = `top: ${unit.top}px; left: ${unit.left}px`;
    }
    return `<span class="unit ${cls}" style="${style}">${element}</span>`;
  }

  public renderDiv(item: any) {
    let div = '';
    let element = '&nbsp;';
    let style = '';
    if (item) {
      div = item.div;
      element = item.element;
    }
    if (item.top && item.left) {
      style = `top: ${item.top}px; left: ${item.left}px; position: absolute`;
    }
    if (item.offMap) {
      style += `; display: none`;
    }

    switch (item.mining) {
      case 'full':
        style += `; animation: mining-full 3s infinite`;
        break;
      case 'half':
        style += `; animation: mining-half 3s infinite`;
        break;
      case 'empty':
        style += `; animation: mining-empty 3s infinite`;
        break;
    }

    return `<div id="${div}" style="${style}">${element}</div>`;
  }

  public updateSpan(actor: any) {
    this.setLayer(this.renderSpan(actor));
  }

  public updateDiv(item: any) {
    this.setLayer(this.renderDiv(item));
  }

  public drawLayer(layerId: any) {
    const el = document.getElementById(layerId)!;
    el.innerHTML = this.getLayer();
  }

  public createInitialChildElement(parentLayerId: any) {
    const el = document.getElementById(parentLayerId)!; // force non-null
    const child = document.createElement('div'); // creates div id within enclosing div ...
    child.innerHTML = this.getLayer();
    el.appendChild(child);
  }
}

export { Renderable, ICoordinates };
