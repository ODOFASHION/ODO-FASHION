import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const sb = createClient('https://gqlcxvukyezqpdftjdeo.supabase.co','sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8');

document.addEventListener('change', async (event) => {
  const select = event.target?.closest?.('.status-select');
  if (!select || !select.dataset.orderId) return;

  const status = select.value;
  try {
    const { error } = await sb.rpc('admin_update_order_status', {
      p_order_id: select.dataset.orderId,
      p_new_status: status
    });
    if (error) {
      console.error('ODO stock update:', error);
      alert(`Stock update failed: ${error.message}`);
      window.odoAdminRefreshOrders?.();
    }
  } catch (error) {
    console.error('ODO stock update:', error);
    alert(`Stock update failed: ${error.message || error}`);
  }
});
