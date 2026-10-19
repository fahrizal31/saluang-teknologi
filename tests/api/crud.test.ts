import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getServices, getServiceBySlug } from '../../src/lib/data/services';
import { getPortfolioProjects, getFeaturedProjects, getPortfolioProjectBySlug } from '../../src/lib/data/portfolio';
import { getTeamMembers } from '../../src/lib/data/team';
import { getCompanyInfo } from '../../src/lib/data/company';

describe('Content & Data Layer Test Suite', () => {
  it('1. Services Data Layer: Mengambil katalog layanan dengan struktur valid', async () => {
    const services = await getServices();
    assert.ok(Array.isArray(services), 'Katalog layanan harus berupa array');
    assert.ok(services.length >= 4, 'Minimal terdapat 4 layanan digital');

    const first = services[0];
    assert.ok(first.id, 'Layanan harus memiliki ID');
    assert.ok(first.slug, 'Layanan harus memiliki slug');
    assert.ok(first.title, 'Layanan harus memiliki title');
    assert.ok(Array.isArray(first.features), 'Layanan harus memiliki daftar fitur');
    assert.ok(Array.isArray(first.techStack), 'Layanan harus memiliki daftar techStack');

    // Test getServiceBySlug
    const bySlug = await getServiceBySlug(first.slug);
    assert.ok(bySlug, `Layanan dengan slug "${first.slug}" harus ditemukan`);
    assert.equal(bySlug?.slug, first.slug);
  });

  it('2. Portfolio Data Layer: Mengambil proyek dan memfilter kategori', async () => {
    const projects = await getPortfolioProjects();
    assert.ok(Array.isArray(projects), 'Proyek portofolio harus berupa array');
    assert.ok(projects.length > 0, 'Daftar proyek tidak boleh kosong');

    const featured = await getFeaturedProjects();
    assert.ok(Array.isArray(featured), 'Proyek featured harus berupa array');

    const first = projects[0];
    assert.ok(first.id, 'Proyek harus memiliki ID');
    assert.ok(first.slug, 'Proyek harus memiliki slug');
    assert.ok(first.title, 'Proyek harus memiliki title');
    assert.ok(first.clientName, 'Proyek harus memiliki clientName');

    const bySlug = await getPortfolioProjectBySlug(first.slug);
    assert.ok(bySlug, `Proyek dengan slug "${first.slug}" harus ditemukan`);
    assert.equal(bySlug?.title, first.title);
  });

  it('3. Team Data Layer: Mengambil profil seluruh anggota tim', async () => {
    const members = await getTeamMembers();
    assert.ok(Array.isArray(members), 'Anggota tim harus berupa array');
    assert.ok(members.length > 0, 'Daftar anggota tim tidak boleh kosong');

    const member = members[0];
    assert.ok(member.name, 'Anggota tim harus memiliki nama');
    assert.ok(member.role, 'Anggota tim harus memiliki jabatan/role');
    assert.ok(member.avatarUrl, 'Anggota tim harus memiliki avatar URL');
  });

  it('4. Company Data Layer: Mengambil profil lengkap, kontak, alamat, dan statistik', async () => {
    const company = await getCompanyInfo();
    assert.ok(company.name, 'Perusahaan harus memiliki nama brand');
    assert.ok(company.legalName, 'Perusahaan harus memiliki nama legal');
    assert.ok(company.phoneWhatsapp, 'Perusahaan harus memiliki nomor WhatsApp');
    assert.ok(company.email, 'Perusahaan harus memiliki alamat email');
    assert.ok(company.address.city, 'Perusahaan harus memiliki data kota alamat');
    assert.ok(Array.isArray(company.stats), 'Perusahaan harus memiliki array statistik bisnis');
    assert.ok(company.stats.length >= 4, 'Minimal 4 metrik statistik bisnis');

    const firstStat = company.stats[0];
    assert.ok(firstStat.label, 'Statistik harus memiliki label');
    assert.ok(firstStat.value, 'Statistik harus memiliki value');
  });
});
