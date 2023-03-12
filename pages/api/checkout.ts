import type { NextApiRequest, NextApiResponse } from 'next';

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  if (req.method === 'POST') {
    const { cart, user } = req.body;

    // get total of order
    const total = cart
      .reduce(
        (accumulator: any, item: any) =>
          accumulator + item.cart_quantity * item.price.salePrice,
        0
      )
      .toFixed(2);

    // create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        address:
          user.selected_user_address.address_line1 +
          ', ' +
          user.selected_user_address.address_line2 +
          ', ' +
          user.selected_user_address.city +
          ' ' +
          user.selected_user_address.post_code,
        price: total,
      })
      .select()
      .single();

    if (!error) {
      // insert order items
      const mappedCart = cart.map((product: any) => {
        const { sku, price, cart_quantity } = product;

        return {
          order_id: order.id,
          price: price.salePrice,
          quantity: cart_quantity,
          sku,
        };
      });

      const { error } = await supabase.from('order_items').insert(mappedCart);

      if (error) console.log('Error inserting order items', error);
    }

    res.status(200).json(order);
  }
}
