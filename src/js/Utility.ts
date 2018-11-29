let id = 0;

function generateId() {
  id = id + 1;
  return id;
}

class Utility {
  public static contains(obj: any, property: any) {
    return Object.keys(obj).indexOf(String(property)) !== -1;
  }

  public static stringToNumber(str: string): any {
    return str.match(/\d+/)![0];
  }

  public static randomize(range: number) {
    return Math.floor(Math.random() * range);
  }

  public static Id() {
    return generateId();
  }

  public static copyArray(arr: any[]) {
    const copy = arr.map(x => x);
    return copy;
  }

  public static probability(percentage: any) {
    const probabilityArray = [];
    for (let i = 0; i < percentage; i++) {
      probabilityArray.push(true);
    }
    for (let i = 0; i < 100 - percentage; i++) {
      probabilityArray.push(false);
    }
    return probabilityArray[Utility.randomize(100)];
  }
}

export default Utility;
