import eventManager from './eventManager';
import { ILandscape } from './LandscapeData';

class Status {
  constructor() {
    eventManager.subscribe('character-moved', this.update, this);
    eventManager.subscribe('display-item', this.displayItem, this);
    eventManager.subscribe('status', this.default, this);
  }

  public update(location: ILandscape) {
    this.set(location.description);
  }

  public beginsWithVowel(text: string) {
    const firstLetter = text[0];
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    let beginsWithVowel = false;
    vowels.forEach(vowel => {
      if (firstLetter === vowel) {
        beginsWithVowel = true;
      }
    });
    return beginsWithVowel;
  }

  public displayItem(itemName: string) {
    const beginsWithVowel = this.beginsWithVowel(itemName);
    let text = '';
    if (beginsWithVowel) {
      text = `you see an ${itemName} here`;
    } else {
      text = `you see a ${itemName} here`;
    }
    this.set(text, 10);
  }

  public default(text: string) {
    this.set(text, 10);
  }

  public set(description: string, delay = 0) {
    window.setTimeout(() => {
      document.getElementById('status')!.innerHTML = description;
    }, delay);
  }
}

export default Status;
