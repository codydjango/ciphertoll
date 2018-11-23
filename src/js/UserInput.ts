import Utility from './Utility';

interface IKeyActionMap {
  '78': () => void;
  '38': () => void;
  '37': () => void;
  '39': () => void;
  '40': () => void;
  '84': () => void;
  '77': () => void;
}

class UserInput {
  public keyActionMap: IKeyActionMap;

  constructor(keyActionMap: IKeyActionMap) {
    this.keyActionMap = keyActionMap;

    document.onkeydown = this.tryActionForEvent.bind(this);
  }

  public tryActionForEvent(event: KeyboardEvent) {
    if (!Utility.contains(this.keyActionMap, event.keyCode)) {
      console.log(`not a valid keycode: ${event.keyCode}`);
    } else {
      this.keyActionMap[event.keyCode]();
    }
  }
}

export default UserInput;
