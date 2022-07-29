import { HeaderMenuColored } from './header';
import Footer from './footer';
import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

interface Props {
    children: React.ReactNode;
}

export default function Layout({ children }: Props) {
    const { data } = useSession();
    const links: any = [
        {
            link: '/about',
            label: 'Features',
        },
        {
            link: '/',
            label: data?.user?.name,
            links: [
                {
                    link: '/api/auth/signout',
                    label: 'Sign out',
                    onClick: () => signOut(),
                },
            ],
        },
    ];

    if (!data) {
        links.push({
            link: '/api/auth/signout',
            label: 'Sign in',
            onClick: () => signIn(),
        });
    }

    // @ts-ignore
    return (
        <>
            <HeaderMenuColored links={{ links }} />
            <main>{children}</main>
            <Footer />
        </>
    );
}
