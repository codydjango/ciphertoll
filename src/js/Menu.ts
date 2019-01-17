import UserInput from './UserInput';
import eventManager from './eventManager';

/**
 * Generalized Menu Functionality
 *
 * The data-holder class instance which wants to use this menu system
 * must pass itself -- 'this' -- into an instance of Menu. Also, the
 * data-holder must own the four methods listed on the ICaller interface.
 *
 */

interface ICaller {
  // fn which returns the array that Menu will work with
  getMenuArray: () => string[];

  // what to do when the cursor selects an array item
  selectMenuItem: (idx: number) => void;

  // what to do once an array item is accessed (via spacebar)
  accessMenuItem: (idx: number) => void;

  // what to do when the user exits the menu
  exitMenu: () => void;
}

export class Menu {
  public item: any;
  public caller: ICaller;
  public itemArray: string[];

  public itemIndex = 0;
  public toggle = false;

  constructor(caller: any) {
    this.caller = caller;
    this.itemArray = this.caller.getMenuArray();
  }

  nextMenuItem = () => {
    if (!this.toggle) {
      this.itemIndex = (this.itemIndex + 1) % this.itemArray.length;
      this.item = this.itemArray[this.itemIndex];
      this.caller.selectMenuItem(this.itemIndex);
    }
  };

  previousMenuItem = () => {
    if (!this.toggle) {
      this.itemIndex = this.itemIndex - 1;
      if (this.itemIndex < 0) {
        this.itemIndex = this.itemArray.length - 1;
      }
      this.item = this.itemArray[this.itemIndex];
      this.caller.selectMenuItem(this.itemIndex);
    }
  };

  accessMenuItem = () => {
    console.log('access');
    if (!this.toggle) {
      this.caller.accessMenuItem(this.itemIndex);
      this.toggle = !this.toggle;
    } else {
      this.caller.selectMenuItem(this.itemIndex);
      this.toggle = !this.toggle;
    }
  };

  exitMenu = () => {
    eventManager.publish('reset-user-input');
    this.caller.exitMenu();
  };

  public initMenuInput = () => {
    return new UserInput({
      '32': this.accessMenuItem, // (space) access item
      '38': this.previousMenuItem, // up arrow key
      '40': this.nextMenuItem, // down arrow key
      '88': this.exitMenu, // e(x)it town
    });
  };
}
