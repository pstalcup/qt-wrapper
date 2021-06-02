import {
  Macro,
  get,
  $item,
  $location,
  $skill,
  $slot,
  have,
  property,
  $skills,
  $effect,
  $monster,
} from "libram";
import {
  setAutoAttack,
  retrieveItem,
  visitUrl,
  availableAmount,
  use,
  equip,
  adv1,
  myInebriety,
  maximize,
  useSkill,
  cliExecute,
  toEffect,
  autosell,
  chew,
  drink,
  myMp,
  mpCost,
  eat,
  haveEffect,
  buy,
  pullsRemaining,
} from "kolmafia";

const KILL_MACRO = Macro.skill("weaksauce")
  .skill("stuffed mortar shell")
  .skill("saucestorm")
  .repeat();

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw message;
  }
}

function autoAttackWrap(action: () => void) {
  try {
    action();
  } finally {
    setAutoAttack(0);
  }
}

function ensureSkill(skill: Skill) {
  if (!have(toEffect(skill))) {
    useSkill(skill);
  }
}

function tryUse(quantity: number, it: Item) {
  if (availableAmount(it) > 0) {
    return use(quantity, it);
  } else {
    return false;
  }
}

function adv(location: Location) {
  adv1(location, -1, () => "");
}

function withRes(element: string, action: () => void) {
  maximize(`hp, ${element} res`, true);
  if (myMp() < mpCost($skill`Cannelloni Cocoon`)) eat($item`magical sausage`);
  useSkill($skill`Cannelloni Cocoon`);
  action();
}

function restock() {
  retrieveItem(6, $item`wrecked generator`);
  retrieveItem(2, $item`moon pie`);
  retrieveItem(6, $item`Frosty's frosty mug`);
  retrieveItem(2, $item`Ol' Scratch's salad fork`);
  retrieveItem(1, $item`spice melange`);
  retrieveItem(1, $item`emergency margarita`);
  retrieveItem(1, $item`Non-euclidean angle`);
  retrieveItem(1, $item`abstraction: category`);
}

function pull() {
  if (pullsRemaining() <= 8) return;
  cliExecute("pull 3 wrecked generator");
  cliExecute("pull 3 frosty's mug");
  cliExecute("pull moon pie");
  cliExecute("pull ol' scratch's salad fork");
  cliExecute("pull spice melange");
  cliExecute("pull emergency margarita");
  cliExecute("pull non-euclidean angle");
  cliExecute("pull abstraction: category");
}

function diet1() {
  if (myInebriety() >= 10) return;

  cliExecute("acquire 3 sausage");

  equip($slot`acc3`, $item`powerful glove`);
  ensureSkill($skill`CHEAT CODE: Triple Size`);

  maximize("mp", true);
  if (myMp() < $skills`Elemental Saucesphere,Astral Shell`.reduce((a, s) => a + mpCost(s), 0)) {
    eat($item`magical sausage`);
  }

  ensureSkill($skill`Feel Peaceful`);
  ensureSkill($skill`Elemental Saucesphere`);
  ensureSkill($skill`Astral Shell`);

  if (!have($effect`Ode to Booze`)) {
    useSkill($skill`The Ode to Booze`, 2);
  }

  withRes("cold", () => {
    cliExecute("drink frosty's mug");
    drink($item`wrecked generator`);
  });
  withRes("cold", () => {
    cliExecute("drink frosty's mug");
    drink($item`wrecked generator`);
  });

  withRes("hot", () => {
    cliExecute("eat ol' scratch's salad fork");
    eat($item`moon pie`);
  });
}

function diet2() {
  if (get("spiceMelangeUsed")) return;

  use($item`spice melange`);

  if (!have($effect`Ode to Booze`)) {
    useSkill($skill`The Ode to Booze`, 1);
  }

  withRes("cold", () => {
    cliExecute("drink frosty's mug");
    drink($item`wrecked generator`);
  });
}

function turn0() {
  if (get("_cargoPocketEmptied")) return;

  visitUrl("tutorial.php?action=toot");
  tryUse(1, $item`letter from King Ralph XI`);
  tryUse(1, $item`pork elf goodies sack`);
  tryUse(1, $item`astral six-pack`);

  let autosellAll = (it: Item) => {
    if (have(it)) autosell(it, availableAmount(it));
  };

  autosellAll($item`baconstone`);
  autosellAll($item`porquoise`);
  autosellAll($item`hamethyst`);

  buy($item`toy accordion`);

  chew($item`abstraction: category`);
  chew($item`non-euclidean angle`);
  cliExecute("cargo pick 37");
}

function cobbsKnob() {
  if (property.getNumber("_backUpUses") >= 10) return;

  equip($slot`acc3`, $item`powerful glove`);
  ensureSkill($skill`CHEAT CODE: Triple Size`);
  maximize("mainstat", false);

  const backupMacro = Macro.skill("Back-Up to your Last Enemy")
    .if_("monstername sausage goblin", KILL_MACRO)
    .abort();

  assert(have($item`backup camera`), "Must have backup camera!");
  equip($slot`acc3`, $item`backup camera`);

  assert(have($item`Kramco Sausage-o-Matic™`), "Must have kramco!");
  equip($slot`off-hand`, $item`Kramco Sausage-o-Matic™`);

  if (get("feelNostalgicMonster") !== $monster`sausage goblin`) {
    assert(get("_lastSausageMonsterTurn") == 0, "Need a guaranteed goblin!");
  }
  KILL_MACRO.setAutoAttack();
  adv($location`The Outskirts of Cobb's Knob`);

  while (property.getNumber("_backUpUses") < 10) {
    backupMacro.setAutoAttack();
    adv($location`The Outskirts of Cobb's Knob`);
  }
}

function hauntedKitchen() {
  if (have($item`Spookyraven billiards room key`)) return;

  KILL_MACRO.setAutoAttack();

  cliExecute("beach head hot");
  cliExecute("beach head stench");

  equip($slot`weapon`, $item`Fourth of May Cosplay Saber`);
  equip($slot`off-hand`, $item`Kramco Sausage-o-Matic™`);
  while (!have($item`Spookyraven billiards room key`)) {
    ensureSkill($skill`Feel Peaceful`);
    ensureSkill($skill`Elemental Saucesphere`);
    ensureSkill($skill`Astral Shell`);
    adv($location`The Haunted Kitchen`);
  }
}

function hauntedBilliardsRoom() {
  if (have($item`Spookyraven library key`)) return;

  KILL_MACRO.setAutoAttack();

  assert(myInebriety() <= 10, "Drank too much!");

  equip($slot`acc3`, $item`powerful glove`);
  ensureSkill($skill`CHEAT CODE: Invisible Avatar`);

  while (!have($item`Spookyraven library key`)) {
    if (have($item`handful of hand chalk`)) use($item`handful of hand chalk`);
    ensureSkill($skill`Sonata of Sneakiness`);
    ensureSkill($skill`Smooth Movement`);

    adv($location`The Haunted Billiards Room`);
  }
}

function day1() {
  pull();
  turn0();
  autoAttackWrap(cobbsKnob);
  diet1();
  autoAttackWrap(hauntedKitchen);
  autoAttackWrap(hauntedBilliardsRoom);
  diet2();
}

export function main(arg: String) {
  if (arg.includes("stock")) {
    restock();
  } else if (arg.includes("day1")) {
    day1();
  }
}
