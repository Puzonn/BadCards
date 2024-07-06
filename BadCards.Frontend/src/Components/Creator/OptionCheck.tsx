export const OptionCheck = ({
  title,
  value,
  valueChanged,
}: {
  title: string;
  value: boolean;
  valueChanged: () => void;
}) => {
  return (
    <div className="flex items-center">
      <input
        checked={value}
        id="disabled-checked-checkbox"
        type="checkbox"
        value=""
        onChange={valueChanged}
        className="w-4 text-black h-4  bg-gray-100 border-gray-300 rounded"
      />
      <label className="ms-2 text-sm font-medium text-black">{title}</label>
    </div>
  );
};
