import React from 'react'
import Select from 'react-select'
import { SelectSearchProps } from './SelectSearch.config'
import { customStyles } from './SelectSearchStyles'

const SelectSearch: React.FC<SelectSearchProps> = ({ onChange, options, onInputChange, isLoading, isSearchable, placeholder }) => {
    return (
        <Select
            // defaultValue
            onChange={onChange}
            options={options}
            styles={customStyles}
            placeholder={placeholder}
            onInputChange={onInputChange}
            isLoading={isLoading}
            isSearchable={isSearchable}
        />
    )
}

export default SelectSearch