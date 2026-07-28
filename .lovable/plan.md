Perbarui nilai secret `KIRIMCHAT_API_KEY` di Supabase menggunakan tool `update_secret`, yang akan membuka form aman untuk memasukkan API key baru dari KirimChat.

Setelah key disimpan, Edge Functions yang memakainya (`send-whatsapp-notification`, `notify-admin-order`, `kirimchat-webhook`, `kirimchat-templates-sync`) otomatis membaca nilai baru pada eksekusi berikutnya — tidak perlu redeploy.

Langkah tindak lanjut opsional: uji dengan menekan tombol "Sinkron dari KirimChat" di `/admin/kirimchat-templates` untuk memastikan key baru valid.