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
  visitUrl,
  availableAmount,
  use,
  equip,
  myInebriety,
  maximize,
  useSkill,
  cliExecute,
  autosell,
  chew,
  drink,
  myMp,
  mpCost,
  eat,
  buy,
  pullsRemaining,
} from "kolmafia";
import {
  autoAttackWrap,
  ensureSkill,
  tryUse,
  KILL_MACRO,
  assert,
  adv,
  questStep,
  setChoice,
  BACKUP_MACRO,
} from "./lib";

function pull() {
  if (pullsRemaining() < 20) return;
  cliExecute("pull 3 wrecked generator");
  cliExecute("pull 3 frosty's mug");
  cliExecute("pull moon pie");
  cliExecute("pull ol' scratch's salad fork");
  cliExecute("pull spice melange");
  cliExecute("pull emergency margarita");
  cliExecute("pull non-euclidean angle");
  cliExecute("pull abstraction: category");
}

function withRes(element: string, action: () => void) {
  maximize(`hp, ${element} res`, true);
  if (myMp() < mpCost($skill`Cannelloni Cocoon`)) eat($item`magical sausage`);
  useSkill($skill`Cannelloni Cocoon`);
  action();
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
    drink($item`frosty's frosty mug`);
    drink($item`wrecked generator`);
  });

  withRes("cold", () => {
    drink($item`frosty's frosty mug`);
    drink($item`wrecked generator`);
  });

  withRes("hot", () => {
    eat($item`ol' scratch's salad fork`);
    eat($item`moon pie`);
  });
}

function diet2() {
  if (get("spiceMelangeUsed")) return;

  use($item`spice melange`);

  if (!have($effect`Ode to Booze`)) {
    useSkill($skill`The Ode to Booze`);
  }

  withRes("cold", () => {
    drink($item`frosty's frosty mug`);
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

  visitUrl("council.php");
}

function cobbsKnob() {
  const outskirts = $location`The Outskirts of Cobb's Knob`;
  const key = $item`Knob Goblin encryption key`;

  if (property.getNumber("_backUpUses") > 10 || have(key) || questStep("questL05Goblin") > 0) {
    return;
  }

  ensureSkill($skill`CHEAT CODE: Triple Size`, () => equip($slot`acc3`, $item`powerful glove`));

  maximize("mainstat", false);

  assert(have($item`backup camera`), "Must have backup camera!");
  equip($slot`acc3`, $item`backup camera`);

  assert(have($item`Kramco Sausage-o-Matic™`), "Must have kramco!");
  equip($slot`off-hand`, $item`Kramco Sausage-o-Matic™`);

  if (
    get("feelNostalgicMonster") !== $monster`sausage goblin` &&
    get("_lastSausageMonsterTurn") === 0
  ) {
    KILL_MACRO.setAutoAttack();
    adv(outskirts);
  }

  if (have($item`familiar scrapbook`)) equip($slot`off-hand`, $item`familiar scrapbook`);

  while (
    property.getNumber("_backUpUses") < 10 &&
    !have(key) &&
    questStep("questL05Goblin") === 0
  ) {
    BACKUP_MACRO.setAutoAttack();
    adv(outskirts);
  }
}

function spookyForest() {
  const forest = $location`Spooky Forest`;
  const larva = $item`mosquito larva`;

  if (
    property.getNumber("_backUpUses") == 11 ||
    forest.turnsSpent > 5 ||
    have(larva) ||
    questStep("questL02Larva") > 0
  )
    return;

  visitUrl("council.php");

  // solve the mosquito quest
  setChoice(502, 2);
  setChoice(505, 1);

  if (get("feelNostalgicMonster") !== $monster`sausage goblin`) return;
  while (
    property.getNumber("_backUpUses") < 11 &&
    !have(larva) &&
    questStep("questL02Larva") === 0
  ) {
    BACKUP_MACRO.setAutoAttack();
    adv(forest);
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

  ensureSkill($skill`CHEAT CODE: Invisible Avatar`, () =>
    equip($slot`acc3`, $item`powerful glove`)
  );

  if (have($item`familiar scrapbook`)) equip($slot`off-hand`, $item`familiar scrapbook`);

  setChoice(875, 1);

  while (!have($item`Spookyraven library key`)) {
    if (have($item`handful of hand chalk`)) use($item`handful of hand chalk`);
    ensureSkill($skill`Sonata of Sneakiness`);
    ensureSkill($skill`Smooth Movement`);

    adv($location`The Haunted Billiards Room`);
  }
}

export function day1() {
  pull();
  turn0();
  autoAttackWrap(cobbsKnob);
  autoAttackWrap(spookyForest);
  autoAttackWrap(hauntedKitchen);
  diet1();
  autoAttackWrap(hauntedBilliardsRoom);
  diet2();
}
