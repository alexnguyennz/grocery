import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';

/*** STATE ***/
import { useStore } from '@/src/state/store';

import type { Cart } from '@/src/utils/supabase';

export default function CartButton() {
  /*** STATE ***/
  const { cart } = useStore();
  const [total, setTotal] = useState<any>(null);

  useEffect(() => {
    if (cart) {
      setTotal(
        // `This expression is not callable` TS issue https://github.com/microsoft/TypeScript/issues/36390
        (cart as any[])
          .reduce(
            (accumulator: string, item: Cart) =>
              accumulator + item.cart_quantity * item.price.salePrice,
            0
          )
          .toFixed(2)
      );
    }
  }, [cart]);

  return (
    <Button
      size="md"
      component={Link}
      href="/checkout/revieworder"
      leftIcon={<IconShoppingCart size={20} />}
      color="cyan.6"
      loading={!total}
      loaderPosition="right"
    >
      ${total}
    </Button>
  );
}
