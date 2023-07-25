import React from 'react';
import footers from '../../routes/footerRoutes';
import Link from 'next/link';

const FooterRoutes = () => {
    return (
        <div>
            {
                footers.map(({ path, name }, index) => (
                    <Link legacyBehavior key={index} href={path}>
                        <a>{name}</a>
                    </Link>
                ))
            }
        </div>
    );
};

export default FooterRoutes;
