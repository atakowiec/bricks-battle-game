import {ReactNode} from 'react';
import style from '../style/navbar.module.scss';
import {NavbarRoute, navbarRoutes} from "../App.tsx";
import {useDispatch} from "react-redux";
import {layoutActions} from "../store/layoutSlice.ts";
import useSelector from "../hooks/useSelector.ts";

export default function () {
    const stage = useSelector(state => state.layout.stage)
    const tab = useSelector(state => state.layout.tab)
    const routes = navbarRoutes[stage] as NavbarRoute[];

    if (!routes) return <></>;

    return (
        <div className={style.navBar}>
            {routes.map(route => (
                <NavbarElement id={route.id} active={route.id === tab}>
                    <NavbarIcon src={`${route.id}.png`} alt={route.id}/>
                </NavbarElement>
            ))}
        </div>
    )
}

// function Navbar({children}: NavbarProps) {
//     const dispatch = useDispatch();
//     const elements = useMemo(() => children.filter(child => child!.type === NavbarElement)
//         .map(child => ({
//             id: child.props.id,
//             children: child.props.children,
//             active: child.props.active
//         } as IElement)), [children]);
//
//     function onTabClick(id: string) {
//         dispatch(layoutActions.setTab(id))
//     }
//
//     return (
//         {
//             elements.map(element => (
//
//             ))
//         }
// </div>
// )
//     ;
// }

function NavbarElement(props: NavbarElementProps) {
    const dispatch = useDispatch();
    const onTabClick = (id: string) => dispatch(layoutActions.setTab(id));

    return (
        <div key={props.id} onClick={() => onTabClick(props.id)}
             className={`${style.element} ${props.active ? style.active : ""}`}>
            {props.children}
        </div>
    );
}

function NavbarIcon({src, alt}: { src: string, alt: string }) {
    return <img src={src} alt={alt}/>;
}

interface NavbarElementProps {
    children: ReactNode;
    id: string;
    active: boolean;
}