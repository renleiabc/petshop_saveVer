import React from 'react'

interface Props {
    title?: string;
    titleClassName?: string;
    color?: string;
    mainClassName?: string;
    onClick?: () => void;
}

const Button = (props: Props) => {
    return (
        <button
            type="button"
            onClick={props.onClick}
            className={`${props.mainClassName ?? ''} w-52 h-16 flex items-center justify-center rounded-xl cursor-pointer border-0`}
        >
            <span className={`${props.titleClassName} text-lg text-textColor`}>{props.title}</span>
        </button>
    )
}

export default Button