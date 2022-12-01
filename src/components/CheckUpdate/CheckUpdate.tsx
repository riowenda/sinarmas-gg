interface CheckUpdateProps {
    text: string,
    handleOnPress?: () => void
}

const CheckUpdate: React.FC<CheckUpdateProps> = ({ text, handleOnPress}) => {
    return (
        <>
            {/*<p>{decode(encode(text))}</p>*/}
        </>
    );
};

export default CheckUpdate;