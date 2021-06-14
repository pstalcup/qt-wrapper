import {
  setAutoAttack,
  toEffect,
  useSkill,
  availableAmount,
  use,
  adv1,
  getInventory,
  visitUrl,
  toInt,
  print,
  getWorkshed,
  toItem,
  xpath,
  autosellPrice,
  toLowerCase,
} from "kolmafia";
import { have, Macro, $items, $item, property } from "libram";

export const KILL_MACRO = Macro.skill("weaksauce")
  .skill("stuffed mortar shell")
  .skill("saucestorm")
  .repeat();

export const BACKUP_MACRO = Macro.if_("monstername sausage goblin", KILL_MACRO)
  .skill("Back-Up to your Last Enemy")
  .if_("monstername sausage goblin", KILL_MACRO)
  .abort();

export function adv(location: Location) {
  adv1(location, -1, "");
}

export function assert(condition: boolean, message: string) {
  if (!condition) {
    throw message;
  }
}

export function autoAttackWrap(action: () => void) {
  try {
    action();
  } finally {
    setAutoAttack(0);
  }
}

export function ensureSkill(skill: Skill, before?: () => void) {
  if (!have(toEffect(skill))) {
    if (before) before();
    useSkill(skill);
  }
}

export function tryUse(quantity: number, it: Item) {
  if (availableAmount(it) > 0) {
    return use(quantity, it);
  } else {
    return false;
  }
}

export function findItem(letter: string) {
  return $items``
    .filter(
      (i) => i.name.indexOf(letter) === 0 && availableAmount(i) > 0 && i.tradeable && i.discardable
    )
    .reduce((max, i) => (availableAmount(i) > availableAmount(max) ? i : max), $item`none`);
}

export function cookPizza(a: Item, b: Item, c: Item, d: Item) {
  // Taken from Katarn https://github.com/s-k-z/seventy-hccs
  print(`Cooking ${a}, ${b}, ${c}, and ${d} into a pizza`);
  let ingredients = [...arguments];
  let effect = ingredients.reduce((s, i) => s + i.name[0], "");

  ingredients.forEach((i) => {
    assert(have(i), `Missing ${i} for cooking pizza (${effect})!`);
  });
  let url = `campground.php?action=makepizza&pizza=${toInt(a)},${toInt(b)},${toInt(c)},${toInt(d)}`;
  print(url);
  visitUrl(url);
  assert(have($item`diabolic pizza`), `Failed to cook pizza ${effect}`);
}

export function questStep(questName: string) {
  const stringStep = property.getString(questName);
  if (stringStep === "unstarted") return -1;
  else if (stringStep === "started") return 0;
  else if (stringStep === "finished") return 999;
  else {
    if (stringStep.substring(0, 4) !== "step") {
      throw "Quest state parsing error.";
    }
    return parseInt(stringStep.substring(4), 10);
  }
}

export function setChoice(adv: number, choice: number) {
  property.set(`choiceAdventure${adv}`, `${choice}`);
}

export function propertySkill(propName: string, skill: Skill) {
  if (!property.getBoolean(propName)) {
    useSkill(skill);
  }
}

export function findPizzaItem(
  letter: string,
  reducer: (a: Item, b: Item) => Item = (a, b) => (autosellPrice(a) < autosellPrice(b) ? a : b)
) {
  if (getWorkshed() !== $item`diabolic pizza cube`) {
    throw "You gotta have your pizza cube out for this to work!";
  }
  const items = xpath(visitUrl("campground.php?action=workshed"), "//form/select/option/text()")
    .map((string) => toLowerCase(string))
    .filter((string) => string.indexOf(letter) === 0)
    .map((string) => string.slice(0, string.indexOf(" (")))
    .map((string) => toItem(string));
  if (items !== []) return items.reduce((a, b) => reducer(a, b));
  else return $item`none`;
}
