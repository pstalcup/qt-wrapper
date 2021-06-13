import {
  cliExecute,
  retrieveItem,
  useSkill,
  myMeat,
  eat,
  drink,
  maximize,
  myMp,
  mpCost,
  myFullness,
  myInebriety,
  equip,
  use,
  availableAmount,
  pullsRemaining,
  print,
} from "kolmafia";
import {
  $item,
  have,
  $skill,
  $effect,
  get,
  $monster,
  $location,
  $slot,
  Macro,
  property,
} from "libram";
import {
  findItem,
  cookPizza,
  KILL_MACRO,
  adv,
  questStep,
  BACKUP_MACRO,
  autoAttackWrap,
  setChoice,
} from "./lib";

function withRes(element: string, action: () => void) {
  print(`maximizing hp and ${element}`, "red");
  maximize(`hp, ${element} res`, true);
  print("Potentially sausaging for mp", "red");
  if (myMp() < mpCost($skill`Cannelloni Cocoon`)) eat($item`magical sausage`);
  useSkill($skill`Cannelloni Cocoon`);
  action();
}

function pull() {
  if (pullsRemaining() < 20) return;
  cliExecute("pull 1 deck of lewd playing cards");
  cliExecute("pull 2 wrecked generator");
  cliExecute("pull 1 mysterious island iced tea");
  cliExecute("pull 1 Flaming Knob");
  cliExecute("pull 2 frosty's frosty mug");
  cliExecute("pull 1 moon pie");
  cliExecute("pull ol' scratch's salad fork");
  let totalClovers =
    availableAmount($item`disassembled clover`) + availableAmount($item`disassembled clover`);
  cliExecute(`pull ${3 - totalClovers} disassembled clover`);
  cliExecute("pull 1 bag of lard");
}

function diet() {
  if (myFullness() > 0 && myInebriety() > 0) return;

  //throw "Day 2 Diet must be done by hand currently";

  // get pizza letters:
  // D I R T
  print("retrieving dry noodles", "red");
  if (!have($item`dry noodles`)) useSkill($skill`Pastamastery`);
  print("retrieving ravioli hat"), "red";
  if (!have($item`ravioli hat`)) retrieveItem($item`ravioli hat`);

  let d = $item`dry noodles`;
  print("finding I item", "red");
  let i = findItem("I");
  print(`Ahh yes, I will use ${i.name} as my source of I`);
  let r = $item`ravioli hat`;
  print("finding T item", "red");
  let t = findItem("T");
  print(`Ahh yes, I will use ${t.name} as my source of T`);

  print("cooking pizza", "red");
  cookPizza(d, i, r, t);
  print("eating pizza", "red");
  eat($item`diabolic pizza`);

  print("ensuring ode", "red");
  if (!have($effect`Ode to Booze`)) {
    useSkill($skill`The Ode to Booze`, 3);
  }

  print("drinking flaming knob", "red");
  drink($item`Flaming Knob`);
  print("drinking iced tea", "red");
  drink($item`Mysterious Island Iced Tea`);

  print("drinking a frostymugged generator", "red");
  withRes("cold", () => {
    drink($item`frosty's frosty mug`);
    drink($item`wrecked generator`);
  });

  print("drinking a frostymugged generator", "red");
  withRes("cold", () => {
    drink($item`frosty's frosty mug`);
    drink($item`wrecked generator`);
  });

  print("drinking a frostymugged generator", "red");
  withRes("hot", () => {
    drink($item`ol' scratch's salad fork`);
    drink($item`moon pie`);
  });
}

function mobOfProtesters() {
  let disClover = $item`disassembled clover`;
  let tenClover = $item`disassembled clover`;

  if ((!have(disClover) && !have(tenClover)) || questStep("questL11Ron") >= 2) return;

  // Sleaze Calculation:
  // beach comb:
  // +15 / +15 - 30 - 30
  // deck of lewd playing cards:
  // +69 / +69 - 138 - 168
  // cosplay saber:
  // +4 / 0 - 4 - 172
  // ghost of a neckalace:
  // +8 / +8 - 16 - 188
  // Gutterminded
  // +50 / 0 - 50 - 238
  // Mysterious Island Iced Tea
  // +40 / +40 - 80 - 318
  // Bag of Lard
  // +50 / 0 - 50 - 368
  // Dirty Pear - sqrt(736) -

  cliExecute("beach head sleaze");
  use($item`bag of lard`);
  maximize("sleaze damage, sleaze spell damage", false);

  equip($slot`weapon`, $item`Fourth of May Cosplay Saber`);
  equip($slot`off-hand`, $item`deck of lewd playing cards`);

  let getClover = () => {
    if (!have(tenClover)) use(disClover);
  };

  setChoice(866, 2);
  setChoice(857, 1);

  while (
    availableAmount(tenClover) + availableAmount(disClover) > 0 &&
    questStep("questL11Ron") < 2
  ) {
    Macro.abort().setAutoAttack();
    getClover();
    adv($location`A Mob of Zeppelin Protesters`);
  }
}

function shen(questLevel: number) {
  if (questStep("questL11Shen") > questLevel || property.getNumber("_backUpUses") >= 11) return;
  maximize("mainstat", false);

  let club = $location`The Copperhead Club`;
  equip($slot`off-hand`, $item`Kramco Sausage-o-Matic™`);

  if (
    get<Monster>("lastCopyableMonster") !== $monster`sausage goblin` &&
    get("_lastSausageMonsterTurn") === 0
  ) {
    KILL_MACRO.setAutoAttack();
    adv(club);
  }

  BACKUP_MACRO.setAutoAttack();
  while (questStep("questL11Shen") == questLevel) {
    adv(club);
  }
}

function shen1() {
  shen(0);
}

export function day2() {
  pull();
  diet();
  autoAttackWrap(mobOfProtesters);
  autoAttackWrap(shen1);
}
