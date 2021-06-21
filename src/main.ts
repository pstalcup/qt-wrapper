import { $class, $item, get, have } from "libram";
import { retrieveItem, print, getCampground, getWorkshed, use, visitUrl } from "kolmafia";
import { day1 } from "./day1";
import { day2 } from "./day2";
import { ascend } from "./ascend";

function restock() {
  retrieveItem(6, $item`wrecked generator`);
  retrieveItem(2, $item`moon pie`);
  retrieveItem(6, $item`Frosty's frosty mug`);
  retrieveItem(2, $item`Ol' Scratch's salad fork`);
  retrieveItem(1, $item`spice melange`);
  retrieveItem(1, $item`emergency margarita`);
  retrieveItem(1, $item`Non-euclidean angle`);
  retrieveItem(1, $item`abstraction: category`);
  retrieveItem(1, $item`Mysterious Island iced tea`);
  retrieveItem(1, $item`Flaming Knob`);
  retrieveItem(3, $item`disassembled clover`);
  retrieveItem(1, $item`bag of lard`);
}

function help() {
  print("qt-wrapper [command]");
  print("   commands:");
  print("   stock - buy relevant consumables for the wrapper to pull");
  print("   day1 - run day 1");
  print("   day2 - run day 2");
}

export function main(arg: String) {
  if (arg.includes("stock")) {
    restock();
  } else if (arg.includes("day1")) {
    day1();
  } else if (arg.includes("day2")) {
    day2();
  } else if (arg.includes("ascend") || arg.includes("gash")) {
    const pizza = $item`diabolic pizza cube`;
    const mushroom = $item`packet of mushroom spores`;
    if (!Object.getOwnPropertyNames(getCampground()).includes(mushroom.name) && have(mushroom))
      use(mushroom);
    if (getWorkshed() !== pizza) {
      if (get("_workshedItemUsed") || !have(pizza)) throw "Unable to cube your pizza :c";
      use(pizza);
    }
    visitUrl("ascend.php?action=ascend&confirm=on&confirm2=on");
    ascend(
      "quantum terrarium",
      $class`sauceror`,
      "softcore",
      2,
      $item`astral six-pack`,
      $item`astral pet sweater`
    );
  } else {
    help();
  }
}
