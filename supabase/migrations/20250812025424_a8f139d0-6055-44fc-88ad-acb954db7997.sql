
-- 1) Create table for legal documents
create table if not exists public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null,
  published boolean not null default true,
  last_updated timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- 2) Enable Row Level Security
alter table public.legal_documents enable row level security;

-- 3) RLS Policies
-- Public can read published documents; Admin can read everything
drop policy if exists "Public read published or admin" on public.legal_documents;
create policy "Public read published or admin"
  on public.legal_documents
  for select
  using (published = true or is_admin_user());

-- Admins can insert
drop policy if exists "Admins can insert legal documents" on public.legal_documents;
create policy "Admins can insert legal documents"
  on public.legal_documents
  for insert
  with check (is_admin_user());

-- Admins can update
drop policy if exists "Admins can update legal documents" on public.legal_documents;
create policy "Admins can update legal documents"
  on public.legal_documents
  for update
  using (is_admin_user())
  with check (is_admin_user());

-- Admins can delete
drop policy if exists "Admins can delete legal documents" on public.legal_documents;
create policy "Admins can delete legal documents"
  on public.legal_documents
  for delete
  using (is_admin_user());

-- 4) updated_at trigger
drop trigger if exists set_legal_documents_updated_at on public.legal_documents;
create trigger set_legal_documents_updated_at
before update on public.legal_documents
for each row execute function public.update_updated_at_column();

-- 5) Seed default privacy policy content
insert into public.legal_documents (slug, title, content, published, last_updated)
values (
  'kebijakan-privasi',
  'Kebijakan Privasi',
  $$<h2>1. Pendahuluan</h2>
<p>Rapatin ("Rapatin," "kami," atau "kita") menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan mengungkapkan informasi pribadi Anda saat Anda menggunakan layanan kami.</p>
<p>Dengan menggunakan layanan kami, Anda menyetujui praktik yang dijelaskan dalam Kebijakan Privasi ini. Jika Anda tidak setuju dengan kebijakan ini, harap jangan gunakan layanan kami.</p>

<h2>2. Informasi yang Kami Kumpulkan</h2>
<p>Kami dapat mengumpulkan beberapa jenis informasi dari dan tentang pengguna layanan kami, termasuk:</p>
<ul>
  <li>Informasi pribadi seperti nama, alamat email, dan nomor telepon.</li>
  <li>Informasi pembayaran untuk memproses transaksi.</li>
  <li>Informasi tentang penggunaan layanan kami, seperti waktu, durasi, dan jumlah peserta rapat.</li>
  <li>Informasi teknis seperti alamat IP, jenis perangkat, dan jenis browser.</li>
</ul>

<h2>3. Bagaimana Kami Menggunakan Informasi Anda</h2>
<p>Kami menggunakan informasi yang kami kumpulkan untuk:</p>
<ul>
  <li>Menyediakan, memelihara, dan meningkatkan layanan kami.</li>
  <li>Memproses pembayaran dan mengelola akun Anda.</li>
  <li>Mengirimkan informasi tentang layanan, pembaruan, dan peristiwa terkait.</li>
  <li>Merespons pertanyaan dan menyediakan dukungan pelanggan.</li>
  <li>Mematuhi kewajiban hukum dan peraturan.</li>
</ul>

<h2>4. Berbagi Informasi Anda</h2>
<p>Kami tidak akan menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Namun, kami dapat membagikan informasi Anda dalam situasi berikut:</p>
<ul>
  <li>Dengan penyedia layanan pihak ketiga yang membantu kami mengoperasikan layanan kami.</li>
  <li>Dengan afiliasi kami untuk tujuan yang dijelaskan dalam Kebijakan Privasi ini.</li>
  <li>Untuk mematuhi kewajiban hukum atau peraturan.</li>
  <li>Untuk melindungi hak, properti, atau keselamatan kami, pengguna kami, atau orang lain.</li>
</ul>

<h2>5. Keamanan Data</h2>
<p>Kami mengimplementasikan langkah-langkah keamanan yang dirancang untuk melindungi informasi pribadi Anda dari akses yang tidak sah atau pengungkapan. Namun, tidak ada metode transmisi internet atau penyimpanan elektronik yang 100% aman, dan kami tidak dapat menjamin keamanan mutlak.</p>

<h2>6. Hak Privasi Anda</h2>
<p>Tergantung pada lokasi Anda, Anda mungkin memiliki hak tertentu terkait dengan informasi pribadi Anda, termasuk:</p>
<ul>
  <li>Hak untuk mengakses informasi pribadi Anda.</li>
  <li>Hak untuk memperbaiki informasi yang tidak akurat.</li>
  <li>Hak untuk menghapus informasi Anda.</li>
  <li>Hak untuk membatasi pemrosesan informasi Anda.</li>
  <li>Hak untuk meminta portabilitas data.</li>
</ul>
<p>Untuk menggunakan hak-hak ini, hubungi kami menggunakan informasi kontak yang disediakan di bawah.</p>

<h2>7. Kebijakan Cookie</h2>
<p>Kami menggunakan cookie dan teknologi pelacakan serupa untuk meningkatkan pengalaman Anda dengan layanan kami. Anda dapat mengontrol penggunaan cookie melalui pengaturan browser Anda.</p>

<h2>8. Perubahan pada Kebijakan Privasi Ini</h2>
<p>Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan diumumkan melalui situs web kami atau melalui email. Kami mendorong Anda untuk meninjau Kebijakan Privasi ini secara berkala.</p>

<h2>9. Hubungi Kami</h2>
<p>Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, hubungi kami di:</p>
<p>Email: <a href="mailto:admin@rapatin.id">admin@rapatin.id</a></p>$$,
  true,
  now()
)
on conflict (slug) do nothing;
