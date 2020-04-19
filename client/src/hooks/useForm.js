import { useState, useCallback } from 'react';
import { validator } from '../validators/validate';

const useForm = (initial, rules = null) => {

    const [errors, setError] = useState({})
    const [state, setState] = useState(initial);

    /**
     * @function
     * Caution using this function.
     * It mutates the whole state of the instance of useForm
     * Useful for hard resets and useForm dependence on values that trigger re-render e.g props value.
     */
    const _set = useCallback(object => setState(object), [])


    const handleChange = async event => {
        if (event) event.persist()

        const { name, value } = event.target

        if (name === "category") {
            if (event.target.checked) {
                setState({
                    ...state,
                    [name]: [...state.category, value]
                })
            } else {
                const getState = state.category.filter(x => x !== value)
                setState({
                    ...state,
                    category: getState
                })
            }
        }
        else {
            setState({
                ...state,
                [name]: value
            })
        }

        if (rules) {

            const temp = errors;
            delete temp[name];
            setError(temp)

            try {
                await validator(
                    { [name]: rules[name] },
                    { [name]: value }
                )
            } catch (error) {
                setError({
                    ...errors,
                    [name]: error.errors[0]
                })
            }
        }
    }

    const handleFileUpload = async (fileItems) => {
        
        setState({
            ...state,
            files: fileItems.map(fileItem => fileItem.file),
        })

        if (rules) {

            const temp = errors;
            delete temp["files"];
            setError(temp)

            try {
                await validator(
                    { files: rules["files"] },
                    { files: fileItems.map(fileItem => fileItem.file) }
                )
            } catch (error) {
                setError({
                    ...errors,
                    files: error.errors[0]
                })
            }
        }
    }

    return [state, handleChange, errors, _set, handleFileUpload]
}

export default useForm;