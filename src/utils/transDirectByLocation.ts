import { Directs, PlayerLocation } from '../enums';

export function transDirectByLocation(location: PlayerLocation, direct: Directs): Directs {
  if (location === PlayerLocation.Left) return direct;
  const rev = {
    [Directs.Left]: Directs.Right,
    [Directs.Right]: Directs.Left,
    [Directs.UpLeft]: Directs.UpRight,
    [Directs.UpRight]: Directs.UpLeft,
    [Directs.DownLeft]: Directs.DownRight,
    [Directs.DownRight]: Directs.DownLeft,
  };
  return rev[direct as keyof typeof rev] || Directs.None;
}
