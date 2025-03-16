import style from './LocationSettings.module.scss';
import { PlayerLocation } from '@core';
export function LocationSettings({
  location,
  onChange,
}: {
  location: PlayerLocation;
  onChange: (location: PlayerLocation) => void;
}): JSX.Element {
  return (
    <section className={style['_']}>
      <label>
        站位：
        <select
          name="location"
          onChange={(e) => {
            onChange(
              e.target.value === String(PlayerLocation.Left)
                ? PlayerLocation.Left
                : PlayerLocation.Right,
            );
          }}
          defaultValue={location}>
          <option key={PlayerLocation.Left} value={PlayerLocation.Left}>
            1P
          </option>
          <option key={PlayerLocation.Right} value={PlayerLocation.Right}>
            2P
          </option>
        </select>
      </label>
    </section>
  );
}
