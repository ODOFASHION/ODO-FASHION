-- ODO ADMIN ORDER STATUS FIX
-- Creates the RPC currently expected by the admin order UI.

create or replace function public.admin_update_order_status(
  p_new_status text,
  p_order_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_status text;
  v_order public.orders%rowtype;
  v_item record;
begin
  if not public.is_odo_admin() then
    raise exception 'Admin access required.';
  end if;

  if upper(coalesce(p_new_status,'')) not in (
    'RECEIVED','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'
  ) then
    raise exception 'Invalid order status.';
  end if;

  select * into v_order
  from public.orders
  where id = p_order_id
  for update;

  if v_order.id is null then
    raise exception 'Order not found.';
  end if;

  v_old_status := upper(coalesce(v_order.order_status,''));

  -- Restore stock if an active order is cancelled.
  if upper(p_new_status) = 'CANCELLED'
     and v_old_status <> 'CANCELLED' then
    for v_item in
      select product_sku, quantity
      from public.order_items
      where order_id = p_order_id
        and product_sku is not null
    loop
      update public.products
      set stock_quantity = coalesce(stock_quantity,0) + coalesce(v_item.quantity,0),
          updated_at = now()
      where sku = v_item.product_sku;
    end loop;
  end if;

  -- If a cancelled order is reopened, deduct stock again atomically.
  if v_old_status = 'CANCELLED'
     and upper(p_new_status) <> 'CANCELLED' then
    for v_item in
      select product_sku, quantity, product_name
      from public.order_items
      where order_id = p_order_id
        and product_sku is not null
    loop
      update public.products
      set stock_quantity = coalesce(stock_quantity,0) - coalesce(v_item.quantity,0),
          updated_at = now()
      where sku = v_item.product_sku
        and coalesce(stock_quantity,0) >= coalesce(v_item.quantity,0);

      if not found then
        raise exception '%: insufficient stock to reopen this order.', coalesce(v_item.product_name,v_item.product_sku);
      end if;
    end loop;
  end if;

  update public.orders
  set order_status = upper(p_new_status),
      updated_at = now()
  where id = p_order_id
  returning * into v_order;

  return jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'order_status', v_order.order_status,
    'total', v_order.total
  );
end;
$$;

grant execute on function public.admin_update_order_status(text, uuid)
to authenticated;
