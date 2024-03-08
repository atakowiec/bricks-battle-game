import {ReactNode} from "react";
import style from "../style/globals.module.scss"


export interface ContainerProps {
    children: ReactNode[];
    className?: string;
}

export function Container(props: ContainerProps) {
    return (
        <div className={`${style.globalContainer} ${props.className ?? ""} `}>
            {props.children}
        </div>
    )
}