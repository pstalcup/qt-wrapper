import { visitUrl, toInt, containsText, print } from "kolmafia";
import { $item, $class, $items, $stat } from "libram";

export enum lifestyle {
  casual = 1,
  softcore = 2,
  normal = 2,
  hardcore = 3,
}

export function ascend(
  pathId: number,
  playerClass: Class,
  lifestyle: lifestyle,
  moon: string | number,
  consumable: Item | undefined = $item`astral six-pack`,
  pet: Item | undefined
) {
  if (!containsText(visitUrl("charpane.php"), "Astral Spirit")) {
    print("It'd really be better if you were already through the gash. Oh well!", "blue");
    visitUrl("ascend.php?action=ascend&confirm=on&confirm2=on");
  }
  if (!containsText(visitUrl("charpane.php"), "Astral Spirit")) throw "Failed to ascend.";
  const avatarPathIds = [8, 10, 12, 17, 23, 26, 29, 35, 38];
  const toMoonId = (moon: string | number): number => {
    if (typeof moon === "number") return moon;

    const offset = (): number => {
      switch (playerClass.primestat) {
        case $stat`Muscle`:
          return 0;
        case $stat`Mysticality`:
          return 1;
        case $stat`Moxie`:
          return 2;
        default:
          throw `unknown prime stat for ${playerClass}`;
      }
    };

    switch ((moon as string).toLowerCase()) {
      case "mongoose":
        return 1;
      case "wallaby":
        return 2;
      case "vole":
        return 3;
      case "platypus":
        return 4;
      case "opossum":
        return 5;
      case "marmot":
        return 6;
      case "wombat":
        return 7;
      case "blender":
        return 8;
      case "packrat":
        return 9;
      case "degrassi":
      case "degrassi knoll":
      case "friendly degrassi knoll":
      case "knoll":
        return 1 + offset();
      case "canada":
      case "canadia":
      case "little canadia":
        return 4 + offset();
      case "gnomads":
      case "gnomish":
      case "gnomish gnomads camp":
        return 7 + offset();
      default:
        return -1;
    }
  };
  const classid = toInt(playerClass);
  if (pathId < 0) throw `Invalid path ID`;
  if (toMoonId(moon) < 1) throw `Invalid moon`;
  if (playerClass === $class`none` || !avatarPathIds.includes(pathId))
    throw `Invalid class ${playerClass}`;
  if (consumable && !$items`astral six-pack, astral hot dog dinner`.includes(consumable))
    throw `Invalid consumable ${consumable}`;
  if (
    pet &&
    !$items`astral bludgeon,
    astral shield, astral chapeau,
    astral bracer, astral longbow,
    astral shorts, astral mace,
    astral ring, astral statuette,
    astral pistol, astral mask,
    astral pet sweater, astral shirt,
    astral belt`.includes(pet)
  )
    throw `Invalid astral item ${pet}`;

  visitUrl("afterlife.php?action=pearlygates");

  if (consumable) visitUrl(`afterlife.php?action=buydeli&whichitem=${toInt(consumable)}`);
  if (pet) visitUrl(`afterlife.php?action=buyarmory&whichitem=${toInt(pet)}`);

  visitUrl(
    `afterlife.php?action=ascend&confirmascend=1&whichsign=${toMoonId(
      moon
    )}&gender=2&whichclass=${classid}&whichpath=${pathId}&asctype=${lifestyle}&nopetok=1&noskillsok=1&pwd`,
    true
  );
}
