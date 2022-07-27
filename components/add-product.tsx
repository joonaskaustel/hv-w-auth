import {
    Box,
    Button,
    Group,
    TextInput,
    TextInputProps,
    useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { useSWRConfig } from 'swr';

const addProductData = async (productData: any, userId: number) => {
    const stringified = JSON.stringify({
        productUrl: productData.url,
        price: productData.lowestPrice,
        name: productData.name,
        userId,
    });

    const res = await fetch('/api/product/add', {
        method: 'POST',
        body: stringified,
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
    });

    const data = await res.json();

    if (res.status !== 200) {
        throw new Error(data.message);
    }
    return data;
};

const getProductData = async (url: string, productUrl: string) => {
    const res = await fetch(`${url}?url=${productUrl}`);
    const data = await res.json();

    if (res.status !== 200) {
        throw new Error(data.message);
    }
    return data;
};

export const AddProduct = (props: TextInputProps) => {
    const { data: session } = useSession();
    const { mutate } = useSWRConfig();
    const theme = useMantineTheme();

    const form = useForm({
        initialValues: {
            link: '',
            termsOfService: false,
        },
        validate: {
            link: (value) => (value ? null : 'Invalid link'),
        },
    });

    const addProductEventSubmit = async (values: any) => {
        const productUrl = values.link;

        const productData = await getProductData(
            `${process.env.NEXT_PUBLIC_APP_API_URL}/api/product/dataFromLink`,
            productUrl
        );
        const userId = session?.dbUserId as number;
        await addProductData(productData, userId);
        await mutate('/api/product/user-products');
        form.reset();
    };

    return (
        <>
            <h1>Subscribe to product</h1>
            <Box sx={{ minWidth: 300 }} mx="auto">
                <form
                    onSubmit={form.onSubmit((values) =>
                        addProductEventSubmit(values)
                    )}
                >
                    <TextInput
                        required
                        label="HV product url"
                        placeholder="https://www.hinnavaatlus.ee/2197459/apple-iphone-13-128gb-midnight/"
                        {...form.getInputProps('link')}
                    />

                    <Group position="right" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Box>
        </>
    );
};
