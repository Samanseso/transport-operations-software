import AppLogoIcon from './app-logo-icon';
import Logo from '../../../public/assets/images/michael_archangel_logo.svg';


export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md text-sidebar-primary-foreground">
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                <figure>
                    <img src={Logo} alt="Logo" />
                </figure>
            </div>
            <div className="ml-1 text-left text-sm flex flex-col leading-tight">
                <span className="truncate font-semibold">Michael Archangel</span>
                <span className="text-[10px] truncate font-semibold">Trucking Operations Software</span>
            </div>

        </>
    );
}
