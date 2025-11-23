import clsx from "clsx";
import styles from "./form-item.module.css";
export default function FormItem({
  label,
  type,
  id,
  name,
  required,
  placeholder,
  select,
  value,
  onChange,
  pattern,
  title,
  options,
  error,
}) {
  const formItemClass = clsx(styles.FormItem, {
    [styles.SelectItem]: select,
  });
  return (
    <div className={formItemClass}>
      {label && <label htmlFor={id}>{label}:</label>}
      {select ? (
        <select
          id={id}
          name={name}
          required={required}
          defaultValue=""
          onChange={onChange}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options &&
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          pattern={pattern}
          title={title}
        />
      )}
      {error && <span className={styles.ErrorMessage}>{error}</span>}
    </div>
  );
}
