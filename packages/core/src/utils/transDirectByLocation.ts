import { Direct, PlayerLocation } from '../enums';

export function transDirectByLocation(location: PlayerLocation, direct: Direct): Direct {
  if (location === PlayerLocation.Left) return direct;
  const rev = {
    [Direct.Left]: Direct.Right,
    [Direct.Right]: Direct.Left,
    [Direct.UpLeft]: Direct.UpRight,
    [Direct.UpRight]: Direct.UpLeft,
    [Direct.DownLeft]: Direct.DownRight,
    [Direct.DownRight]: Direct.DownLeft,
  };
  return rev[direct as keyof typeof rev] ?? direct;
}
