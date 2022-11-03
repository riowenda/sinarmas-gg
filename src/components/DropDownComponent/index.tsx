interface DropDownProps {
    title: string;
}

const DropDownComponent: React.FC<DropDownProps> = ({ title, children }) => {
    return (
        <div className="mb-3">
            <h3 className="truncate text-base font-medium text-black">{title}</h3>

            {children}
        </div>

    )
}

export default DropDownComponent