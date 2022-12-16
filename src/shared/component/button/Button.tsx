import React from 'react';
import './Button.scss';

interface Props {
    name: string;
    action: () => void;
}

const FormCard = (props: Props) => {
    return (
        <div className="Button flex-1" onClick={props.action}>
            {props.name}
        </div>
    );
};

export default FormCard;
