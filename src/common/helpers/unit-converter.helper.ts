
export class UnitConverter {

  static gramsToKilograms(grams: number): number {
    return grams / 1000;
  }

  static kilogramsToGrams(kilograms: number): number {
    return kilograms * 1000;
  }

  static millilitersToLiters(ml: number): number {
    return ml / 1000;
  }

  static litersToMilliliters(liters: number): number {
    return liters * 1000;
  }
}