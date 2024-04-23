import style from './InfoPage.module.scss';

interface InfoElements {
  title: string;
  url: string;
  icon: string;
}

const elements: InfoElements[] = [
  {
    title: 'Trash can icons created by Freepik - Flaticon',
    url: 'https://www.flaticon.com/free-icons/trash-can',
    icon: 'trash-can.png',
  },
  {
    title: 'Settings icons created by Freepik - Flaticon',
    url: 'https://www.flaticon.com/free-icons/settings',
    icon: 'settings.png',
  },
  {
    title: 'Sparkles icons created by riajulislam - Flaticon',
    url: 'https://www.flaticon.com/free-icons/sparkles',
    icon: 'personalize.png',
  },
  {
    title: 'Pencil icons created by Pixel perfect - Flaticon',
    url: 'https://www.flaticon.com/free-icons/pencil',
    icon: 'pencil.png',
  },
  {
    title: 'Block icons created by yaicon - Flaticon',
    url: 'https://www.flaticon.com/free-icons/block',
    icon: 'map-hub.png',
  },
  {
    title: 'Real estate icons created by Tanah Basah - Flaticon',
    url: 'https://www.flaticon.com/free-icons/real-estate',
    icon: 'main.png',
  },
  {
    title: 'Fill icons created by Freepik - Flaticon',
    url: 'https://www.flaticon.com/free-icons/fill',
    icon: 'fill.png',
  },
  {
    title: 'Eraser icons created by Iconjam - Flaticon',
    url: 'https://www.flaticon.com/free-icons/eraser',
    icon: 'eraser.png',
  },
  {
    title: 'User icons created by Freepik - Flaticon',
    url: 'https://www.flaticon.com/free-icons/user',
    icon: 'account.png',
  },
  {
    title: 'Info icons created by Chanut - Flaticon',
    url: 'https://www.flaticon.com/free-icons/info',
    icon: 'info.png',
  },
];

export function InfoPage() {
  return (
    <div>
      <h1>Info Page</h1>
      <div className={style.elementsBox}>
      {elements.map((element, index) => (
        <a className={style.infoElement} key={index} href={element.url}>
          <img src={`/assets/${element.icon}`} alt={element.title} />
          <span>
            {element.title}
          </span>
        </a>
      ))}
      </div>
    </div>
  );
}