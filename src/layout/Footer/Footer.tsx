import { FC, ReactNode } from 'react';
import Link from 'next/link';
interface IFooterProps {

    children: ReactNode;
}

const Footer: FC<IFooterProps> = ({  children }) => {
    return (
        <footer className='footer'>
         
            {children}
        </footer>
    );
};

export default Footer;
