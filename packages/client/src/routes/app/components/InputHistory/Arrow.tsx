import Style from './Arrow.module.scss';
import { Direct } from '@core';
import { getClassNames } from '@tool-pack/basic';

export function Arrow({ direct }: { direct: Direct }) {
  return (
    <div className={Style['_']}>
      <div className={getClassNames('arrow', Direct[direct])}>
        <div className="body">
          <div className="head"></div>
        </div>
      </div>
    </div>
  );
}
