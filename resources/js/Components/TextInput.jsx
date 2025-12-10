import { forwardRef, useEffect, useRef } from 'react';
import { InputGroup, InputGroupInput } from './ui/input-group';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, placeholder = '', ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <InputGroup>
            <InputGroupInput
                placeholder={placeholder}
                className={
                    // 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                    className
                }
                ref={input}
                {...props}
            />
            {/* <InputGroupAddon>
                <SearchIcon />
            </InputGroupAddon> */}
        </InputGroup>
        // <input
        //     {...props}
        //     type={type}
        //     className={
        //         'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
        //         className
        //     }
        //     ref={input}
        // />
    );
});
