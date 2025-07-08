import InputLabel from '@/Components/Form/InputLabel'
import {clsx} from "clsx";

export default function Checkbox({className, labelClassName, label, id, name, value, handleChange}) {
    return <InputLabel forInput={id}>
        <input
            type="checkbox"
            id={id}
            name={name}
            value={value}
            className={clsx("rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500", className)}
            onChange={(e) => handleChange(e)}
        />
        <span className={clsx('mx-2 font-light', labelClassName)}>{label}</span>
    </InputLabel>
}
