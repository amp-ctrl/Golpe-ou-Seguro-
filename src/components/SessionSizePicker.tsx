import { SESSION_SIZES, type SessionSize } from '../services/sessionBuilder';

interface Props { value: SessionSize; onChange: (size: SessionSize) => void }

export function SessionSizePicker({ value, onChange }: Props) {
  return (
    <fieldset className="session-size-picker">
      <legend>Questões por partida</legend>
      <div className="session-size-options">
        {SESSION_SIZES.map((size) => (
          <label key={size}>
            <input type="radio" name="session-size" value={size} checked={value === size} onChange={() => onChange(size)} />
            <span>{size}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
