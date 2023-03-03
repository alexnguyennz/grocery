import { useState, useEffect, useRef } from 'react';

import {
  Button,
  NumberInput,
  Group,
  ActionIcon,
  NumberInputHandlers,
  Transition,
  Paper,
} from '@mantine/core';

import { useClickOutside } from '@mantine/hooks';

import { useStore } from '@/src/state/store';

import { type Products } from '@/src/utils/supabase';

export default function Quantity({ product }: { product: Products }) {
  /*** STATE ***/
  const cart = useStore((state) => state.cart);

  const addToCart = useStore((state) => state.addToCart);
  const addQuantity = useStore((state) => state.addQuantity);
  const subtractQuantity = useStore((state) => state.subtractQuantity);

  const [quantity, setQuantity] = useState<number | null | any>(0);
  const handlers = useRef<NumberInputHandlers>();

  useEffect(() => {
    const item = cart.find((item: any) => item.sku === product.sku);

    if (item) {
      setQuantity(item.cart_quantity);
    } else {
      setQuantity(0);
      setOpened(true);
    }
  }, [cart]);

  const [opened, setOpened] = useState(false);
  const [openedTwo, setOpenedTwo] = useState(false);
  const clickOutsideRef = useClickOutside(() => setOpened(false));

  const scaleY = {
    in: { opacity: 1, transform: 'scaleY(1)' },
    out: { opacity: 0, transform: 'scaleY(0)' },
    common: { transformOrigin: 'top' },
    transitionProperty: 'transform, opacity',
  };

  return (
    <>
      <Transition
        mounted={opened}
        transition="fade"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Button
            style={{
              ...styles,
            }}
            onClick={() => {
              addToCart(product);
              setOpened(false);
              setOpenedTwo(true);
            }}
            color="dark.5"
            fullWidth
            radius="xl"
          >
            Add to cart
          </Button>
        )}
      </Transition>

      <Transition
        mounted={openedTwo}
        transition="fade"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Group
            style={{
              ...styles,
            }}
            spacing={0}
            noWrap
          >
            <NumberInput
              hideControls
              value={quantity}
              onChange={(val) => setQuantity(val!)}
              handlersRef={handlers}
              max={10}
              min={0}
              step={1}
              styles={{
                input: { width: 'full', borderRadius: '32px 0px 0px 32px' },
              }}
            />
            <ActionIcon
              color="dark.5"
              variant="filled"
              size={36}
              onClick={() => subtractQuantity(product)}
              radius={0}
            >
              &#8211;
            </ActionIcon>
            <ActionIcon
              color="dark.5"
              variant="filled"
              size={36}
              onClick={() => addQuantity(product)}
              radius={0}
              styles={{
                root: { borderRadius: '0px 32px 32px 0px' },
              }}
              className="rounded-lg"
            >
              +
            </ActionIcon>
          </Group>
        )}
      </Transition>
    </>
  );
}
