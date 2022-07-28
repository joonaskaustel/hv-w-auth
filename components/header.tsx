import {
    Burger,
    Center,
    Container,
    createStyles,
    Group,
    Header,
    Menu,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

const useStyles = createStyles((theme) => ({
    inner: {
        height: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color:
            theme.colorScheme === 'dark'
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
        },
    },

    linkLabel: {
        marginRight: 5,
    },
}));

export interface HeaderSearchProps {
    links: {
        link: string;
        label: string;
        links?: { link: string; label: string }[];
    }[];
}

interface IProps {
    links: any;
}

export function HeaderMenuColored(props: IProps) {
    const { links } = props;
    const { classes, theme, cx } = useStyles();
    const [opened, { toggle }] = useDisclosure(false);

    const user = {};

    const [userMenuOpened, setUserMenuOpened] = useState(false);

    const items = links.links.map((link: any) => {
        const menuItems = link.links?.map((item: any) => (
            <Menu.Item key={item.link}>{item.label}</Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu
                    key={link.label}
                    trigger="hover"
                    exitTransitionDuration={0}
                >
                    <Menu.Target>
                        <a
                            href={link.link}
                            className={classes.link}
                            onClick={(event) => event.preventDefault()}
                        >
                            <Center>
                                <span className={classes.linkLabel}>
                                    {link.label}
                                </span>
                                {/*<IconChevronDown size={12} stroke={1.5} />*/}
                            </Center>
                        </a>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <a
                key={link.label}
                href={link.link}
                className={classes.link}
                onClick={(event) => event.preventDefault()}
            >
                {link.label}
            </a>
        );
    });

    return (
        <Header height={56} className={classes.link} mb={120}>
            {/*<Container className={classes.mainSection}>*/}
            {/*  <Group position="apart">*/}
            {/*    <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />*/}

            {/*    <Menu*/}
            {/*      width={260}*/}
            {/*      position="bottom-end"*/}
            {/*      transition="pop-top-right"*/}
            {/*      onClose={() => setUserMenuOpened(false)}*/}
            {/*      onOpen={() => setUserMenuOpened(true)}*/}
            {/*    >*/}
            {/*      <Menu.Target>*/}
            {/*        <UnstyledButton*/}
            {/*          className={cx(classes.user, { [classes.userActive]: userMenuOpened })}*/}
            {/*        >*/}
            {/*          <Group spacing={7}>*/}
            {/*            <Avatar src={user.image} alt={user.name} radius="xl" size={20} />*/}
            {/*            <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>*/}
            {/*              {user?.name}*/}
            {/*            </Text>*/}
            {/*            <IconChevronDown size={12} stroke={1.5} />*/}
            {/*          </Group>*/}
            {/*        </UnstyledButton>*/}
            {/*      </Menu.Target>*/}
            {/*      <Menu.Dropdown>*/}
            {/*        <Menu.Item icon={<IconHeart size={14} color={theme.colors.red[6]} stroke={1.5} />}>*/}
            {/*          Liked posts*/}
            {/*        </Menu.Item>*/}
            {/*        <Menu.Item icon={<IconStar size={14} color={theme.colors.yellow[6]} stroke={1.5} />}>*/}
            {/*          Saved posts*/}
            {/*        </Menu.Item>*/}
            {/*        <Menu.Item icon={<IconMessage size={14} color={theme.colors.blue[6]} stroke={1.5} />}>*/}
            {/*          Your comments*/}
            {/*        </Menu.Item>*/}

            {/*        <Menu.Label>Settings</Menu.Label>*/}
            {/*        <Menu.Item icon={<IconSettings size={14} stroke={1.5} />}>Account settings</Menu.Item>*/}
            {/*        <Menu.Item icon={<IconSwitchHorizontal size={14} stroke={1.5} />}>*/}
            {/*          Change account*/}
            {/*        </Menu.Item>*/}
            {/*        <Menu.Item icon={<IconLogout size={14} stroke={1.5} />}>Logout</Menu.Item>*/}

            {/*        <Menu.Divider />*/}

            {/*        <Menu.Label>Danger zone</Menu.Label>*/}
            {/*        <Menu.Item icon={<IconPlayerPause size={14} stroke={1.5} />}>*/}
            {/*          Pause subscription*/}
            {/*        </Menu.Item>*/}
            {/*        <Menu.Item color="red" icon={<IconTrash size={14} stroke={1.5} />}>*/}
            {/*          Delete account*/}
            {/*        </Menu.Item>*/}
            {/*      </Menu.Dropdown>*/}
            {/*    </Menu>*/}
            {/*  </Group>*/}
            {/*</Container>*/}

            <Container>
                <div className={classes.inner}>
                    {/*<MantineLogo size={28} inverted />*/}
                    💱 hinnateavitus
                    <Group spacing={5} className={classes.links}>
                        {items}
                    </Group>
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        className={classes.burger}
                        size="sm"
                        color="#fff"
                    />
                </div>
            </Container>
        </Header>
    );
}
