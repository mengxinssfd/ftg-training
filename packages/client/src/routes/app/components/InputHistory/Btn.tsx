import Style from './Btn.module.scss';

export function Btn({ name }: { name: string }) {
  return (
    <div className={Style['_']}>
      <span className={name}></span>
    </div>
  );
}
