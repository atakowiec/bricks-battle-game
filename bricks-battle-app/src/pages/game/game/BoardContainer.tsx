import style from './Game.module.scss';
import { createContext, ReactNode, useContext, useLayoutEffect, useRef, useState } from 'react';

const BoardSizeContext = createContext(0);

export function useBoardSize() {
  return useContext(BoardSizeContext)
}

export function BoardContainer(props: { children: ReactNode }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);

  useLayoutEffect(() => {
    onResize();

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function onResize() {
    const boundingRect = boardRef.current!.getBoundingClientRect();

    setSize(Math.min(boundingRect.width, boundingRect.height));
  }

  return (
    <div className={style.boardContainer} ref={boardRef}>
      <div className={style.boardBox} style={{ height: `${size}px`, width: `${size}px` }}>
        <BoardSizeContext.Provider value={size}>
          {props.children}
        </BoardSizeContext.Provider>
      </div>
    </div>
  );
}