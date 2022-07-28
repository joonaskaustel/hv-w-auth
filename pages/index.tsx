import Layout from '../components/layout';
import ProductList from '../components/product-list';
import { AddProduct } from '../components/add-product';
import { signIn, useSession } from 'next-auth/react';

import { Button, Container, createStyles, Text, Title } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: 'relative',
        paddingTop: 120,
        paddingBottom: 80,

        '@media (max-width: 755px)': {
            paddingTop: 80,
            paddingBottom: 60,
        },
    },

    inner: {
        position: 'relative',
        zIndex: 1,
    },

    dots: {
        position: 'absolute',
        color:
            theme.colorScheme === 'dark'
                ? theme.colors.dark[5]
                : theme.colors.gray[1],

        '@media (max-width: 755px)': {
            display: 'none',
        },
    },

    dotsLeft: {
        left: 0,
        top: 0,
    },

    title: {
        textAlign: 'center',
        fontWeight: 800,
        fontSize: 40,
        letterSpacing: -1,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        marginBottom: theme.spacing.xs,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,

        '@media (max-width: 520px)': {
            fontSize: 28,
            textAlign: 'left',
        },
    },

    highlight: {
        color: theme.colors[theme.primaryColor][
            theme.colorScheme === 'dark' ? 4 : 6
        ],
    },

    description: {
        textAlign: 'center',

        '@media (max-width: 520px)': {
            textAlign: 'left',
            fontSize: theme.fontSizes.md,
        },
    },

    controls: {
        marginTop: theme.spacing.lg,
        display: 'flex',
        justifyContent: 'center',

        '@media (max-width: 520px)': {
            flexDirection: 'column',
        },
    },

    control: {
        '&:not(:first-of-type)': {
            marginLeft: theme.spacing.md,
        },

        '@media (max-width: 520px)': {
            height: 42,
            fontSize: theme.fontSizes.md,

            '&:not(:first-of-type)': {
                marginTop: theme.spacing.md,
                marginLeft: 0,
            },
        },
    },
}));

export default function IndexPage() {
    const { data: session } = useSession();

    const { classes } = useStyles();

    return (
        <Layout>
            <Container className={classes.wrapper} size={1400}>
                <div className={classes.inner}>
                    <Title className={classes.title}>
                        Automated{' '}
                        <Text
                            component="span"
                            className={classes.highlight}
                            inherit
                        >
                            price notifications
                        </Text>{' '}
                        for any page
                    </Title>

                    <Container p={0} size={600}>
                        <Text
                            size="lg"
                            color="dimmed"
                            className={classes.description}
                        >
                            Find desired product, get notified when price lowers
                        </Text>
                    </Container>

                    {!session && (
                        <div className={classes.controls}>
                            <Button
                                className={classes.control}
                                size="lg"
                                variant="default"
                                color="gray"
                                onClick={() => signIn()}
                            >
                                Sign in
                            </Button>
                        </div>
                    )}
                    <div style={{ maxWidth: '800px', margin: '20px auto' }}>
                        {session && <AddProduct />}
                        {session && <ProductList />}
                    </div>
                </div>
            </Container>
        </Layout>
    );
}
